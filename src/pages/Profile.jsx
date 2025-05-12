import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaSave, FaTimes, FaSignOutAlt, FaCamera } from 'react-icons/fa';

function Profile() {
  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ email: '', phone: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const userResponse = await fetch('http://localhost:5000/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userResponse.json();
        if (userResponse.ok) {
          setUser(userData);
          setFormData({ email: userData.email || '', phone: userData.phone || '' });
        } else {
          setError(userData.message || 'Ошибка при загрузке данных');
        }

        const complaintsResponse = await fetch('http://localhost:5000/api/complaints', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const complaintsData = await complaintsResponse.json();
        if (complaintsResponse.ok) {
          setComplaints(complaintsData);
        } else {
          setError(complaintsData.message || 'Ошибка при загрузке жалоб');
        }
      } catch (err) {
        setError('Ошибка при загрузке данных: ' + err.message);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/user/update', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        setUser({ ...user, email: formData.email, phone: formData.phone });
        setSuccess(result.message);
        setIsEditing(false);
      } else {
        setError(result.message || 'Ошибка при обновлении данных');
      }
    } catch (err) {
      setError('Ошибка при обновлении данных: ' + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const fadeInVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const profileButtonVariants = {
    initial: { scale: 1, backgroundColor: 'inherit' },
    animate: {
      scale: [1, 1.02, 1],
      transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
    },
    hover: {
      scale: 1.08,
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      transition: { duration: 0.4 },
    },
  };

  const buttonVariants = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.03, 1],
      transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
    },
    hover: { scale: 1.05, boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)', transition: { duration: 0.3 } },
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-[80vh] flex flex-col items-center py-12 sm:py-16">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="initial" animate="animate" variants={stagger}>
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-8 sm:mb-12 text-center font-manrope bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-amber-400"
            variants={fadeInVariants}
          >
            Мой кабинет
          </motion.h1>

          {user && (
            <motion.div
              className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              variants={fadeInVariants}
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-indigo-200 to-amber-200 flex items-center justify-center text-gray-500 text-3xl sm:text-4xl font-bold overflow-hidden">
                    {user.username ? user.username[0].toUpperCase() : 'U'}
                    <motion.div
                      className="absolute bottom-0 right-0 bg-amber-400 rounded-full p-2 sm:p-2.5 text-white hover:bg-amber-500 transition-colors duration-200 cursor-pointer"
                      variants={profileButtonVariants}
                      initial="initial"
                      whileHover="hover"
                    >
                      <FaCamera className="text-sm sm:text-base" />
                    </motion.div>
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 font-inter">
                    Информация о пользователе
                  </h2>
                  {error && (
                    <p className="text-red-500 text-xs sm:text-sm font-inter mb-3 bg-red-50 p-2 rounded-lg">
                      {error}
                    </p>
                  )}
                  {success && (
                    <p className="text-green-500 text-xs sm:text-sm font-inter mb-3 bg-green-50 p-2 rounded-lg">
                      {success}
                    </p>
                  )}
                  <div className="space-y-3">
                    <p className="text-gray-700 text-lg sm:text-xl font-inter">
                      <strong className="text-gray-900 text-xl sm:text-2xl">Имя:</strong> {user.username}
                    </p>
                    {isEditing ? (
                      <form onSubmit={handleUpdate} className="space-y-3">
                        <div>
                          <label className="block text-gray-900 font-semibold text-sm mb-1 font-inter">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-xs sm:text-sm font-inter transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-900 font-semibold text-sm mb-1 font-inter">Телефон</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-xs sm:text-sm font-inter transition-all duration-200"
                          />
                        </div>
                        <div className="flex space-x-3">
                          <motion.button
                            type="submit"
                            variants={profileButtonVariants}
                            initial="initial"
                            animate="animate"
                            whileHover="hover"
                            className="flex items-center bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900 px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm font-inter"
                          >
                            <FaSave className="mr-1.5" />
                            Сохранить
                          </motion.button>
                          <motion.button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            variants={profileButtonVariants}
                            initial="initial"
                            animate="animate"
                            whileHover="hover"
                            className="flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm font-inter"
                          >
                            <FaTimes className="mr-1.5" />
                            Отмена
                          </motion.button>
                        </div>
                      </form>
                    ) : (
                      <div>
                        <p className="text-gray-700 text-sm sm:text-base font-inter">
                          <strong className="text-gray-900">Email:</strong> {user.email || 'Не указан'}
                        </p>
                        <p className="text-gray-700 text-sm sm:text-base font-inter">
                          <strong className="text-gray-900">Телефон:</strong> {user.phone || 'Не указан'}
                        </p>
                        <motion.button
                          onClick={() => setIsEditing(true)}
                          variants={profileButtonVariants}
                          initial="initial"
                          animate="animate"
                          whileHover="hover"
                          className="mt-3 flex items-center bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm font-inter"
                        >
                          <FaEdit className="mr-1.5" />
                          Редактировать
                        </motion.button>
                      </div>
                    )}
                    <motion.button
                      onClick={handleLogout}
                      variants={profileButtonVariants}
                      initial="initial"
                      animate="animate"
                      whileHover="hover"
                      className="mt-3 flex items-center bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm font-inter"
                    >
                      <FaSignOutAlt className="mr-1.5" />
                      Выйти
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            variants={fadeInVariants}
          >
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 font-inter">
              Мои жалобы
            </h2>
            {complaints.length === 0 ? (
              <p className="text-gray-600 text-base sm:text-lg font-inter">Жалобы отсутствуют</p>
            ) : (
              <ul className="space-y-6">
                {complaints.map((complaint) => (
                  <motion.li
                    key={complaint._id}
                    className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    variants={fadeInVariants}
                  >
                    <p className="text-gray-900 font-semibold text-lg sm:text-xl font-inter">
                      Дата: {new Date(complaint.date).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 text-base sm:text-lg font-inter">
                      Сумма: Не указана
                    </p>
                    <p className="text-gray-600 text-base sm:text-lg font-inter">
                      Статус:{' '}
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-sm font-semibold ${
                          complaint.status === 'В обработке'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {complaint.status}
                      </span>
                    </p>
                    {complaint.photo && (
                      <p className="text-gray-600 text-base sm:text-lg font-inter">
                        Фото:{' '}
                        <a
                          href={complaint.photo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-500 underline"
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

          <motion.div
            variants={buttonVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            className="text-center"
          >
            <Link
              to="/submit-complaint"
              className="inline-flex items-center bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-amber-500 transition duration-300 font-inter"
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

export default Profile;