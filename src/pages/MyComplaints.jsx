import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { decodeJwt } from 'jose';

function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComplaints = async () => {
      setIsLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Необходимо войти в систему.');
        navigate('/login');
        setIsLoading(false);
        return;
      }

      try {
        const decoded = decodeJwt(token);
        if (decoded.exp * 1000 < Date.now()) {
          setError('Сессия истекла. Пожалуйста, войдите снова.');
          localStorage.removeItem('token');
          navigate('/login');
          setIsLoading(false);
          return;
        }

        const response = await fetch('http://localhost:5000/api/complaints', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setComplaints(data);
        } else {
          setError(data.message || 'Ошибка при загрузке жалоб.');
        }
      } catch (err) {
        setError('Ошибка при загрузке жалоб: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplaints();
  }, [navigate]);

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(amount || 0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'В обработке':
        return 'text-orange-500';
      case 'Одобрено':
        return 'text-green-500';
      case 'Отклонено':
        return 'text-red-500';
      default:
        return 'text-gray-600';
    }
  };

  const fadeInVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' },
  };

  const stagger = {
    animate: { transition: { staggerChildren: 0.2 } },
  };

  return (
    <div className="bg-gray-50 min-h-[80vh] flex flex-col items-center py-12 sm:py-16">
      <div className="w-full max-w-7xl mx-auto p-6 sm:p-8">
        <motion.div initial="initial" animate="animate" variants={stagger}>
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 sm:mb-8 text-center font-manrope"
            variants={fadeInVariants}
          >
            Мои жалобы
          </motion.h1>
          <motion.div
            className="bg-white p-6 sm:p-8 rounded-lg shadow-sm mb-6"
            variants={fadeInVariants}
          >
            {isLoading ? (
              <p className="text-gray-600 text-sm sm:text-base font-inter text-center">Загрузка...</p>
            ) : error ? (
              <p className="text-red-500 text-sm sm:text-base font-inter mb-4">{error}</p>
            ) : complaints.length === 0 ? (
              <p className="text-gray-600 text-sm sm:text-base font-inter text-center">Жалобы отсутствуют.</p>
            ) : (
              <ul className="space-y-4">
                {complaints.map((complaint) => (
                  <motion.li
                    key={complaint._id}
                    className="border-b border-gray-200 pb-4 last:border-b-0"
                    variants={fadeInVariants}
                  >
                    <p className="text-gray-900 font-semibold text-base sm:text-lg font-inter">
                      Дата:{' '}
                      {new Date(complaint.date).toLocaleDateString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <p className="text-gray-600 text-sm sm:text-base font-inter">
                      Сумма: {complaint.amount ? formatAmount(complaint.amount) : 'Не указана'}
                    </p>
                    <p className={`text-sm sm:text-base font-inter ${getStatusColor(complaint.status)}`}>
                      Статус: {complaint.status || 'Не указан'}
                    </p>
                    {complaint.photo && (
                      <p className="text-gray-600 text-sm sm:text-base font-inter">
                        Фото:{' '}
                        <a
                          href={`http://localhost:5000${complaint.photo}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-500"
                          aria-label={`Посмотреть фото жалобы от ${new Date(complaint.date).toLocaleDateString('ru-RU')}`}
                        >
                          Посмотреть
                        </a>
                      </p>
                    )}
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>
          <motion.div variants={buttonVariants} whileHover="hover" className="text-center">
            <Link
              to="/submit-complaint"
              className="inline-flex items-center bg-amber-400 text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-amber-500 transition duration-300 font-inter"
              aria-label="Добавить новую жалобу"
            >
              Добавить жалобу
              <motion.span className="ml-2">
                <FaPlus />
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default MyComplaints;