import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({ username: '', password: '', email: '', phone: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Сохраняем данные пользователя в localStorage
      const user = {
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        password: formData.password, // В реальном проекте пароль нужно хешировать
        createdAt: new Date().toISOString(),
      };

      // Сохраняем пользователя (в реальном проекте это должен быть сервер)
      localStorage.setItem('user_' + formData.email, JSON.stringify(user));
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', formData.email);

      setSuccess('Регистрация прошла успешно!');
      navigate('/home'); // Перенаправляем на /home
    } catch (err) {
      setError('Ошибка при регистрации: ' + (err.message || 'Попробуйте снова'));
    }
  };

  const fadeInVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const buttonVariants = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.02, 1],
      transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
    },
    hover: { scale: 1.05, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' },
  };

  return (
    <div className="bg-gray-50 min-h-[80vh] flex flex-col items-center justify-center py-12 sm:py-16">
      <div className="w-full max-w-md mx-auto p-6 sm:p-8">
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 sm:mb-8 text-center font-manrope"
          initial="initial"
          animate="animate"
          variants={fadeInVariants}
        >
          Регистрация
        </motion.h1>

        <motion.div
          className="bg-white p-6 sm:p-8 rounded-lg shadow-sm"
          initial="initial"
          animate="animate"
          variants={fadeInVariants}
        >
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-gray-900 font-semibold mb-1 font-inter">Имя пользователя</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-sm sm:text-base font-inter"
                required
              />
            </div>

            <div>
              <label className="block text-gray-900 font-semibold mb-1 font-inter">Пароль</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-sm sm:text-base font-inter"
                required
              />
            </div>

            <div>
              <label className="block text-gray-900 font-semibold mb-1 font-inter">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-sm sm:text-base font-inter"
                required
              />
            </div>

            <div>
              <label className="block text-gray-900 font-semibold mb-1 font-inter">Телефон</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-sm sm:text-base font-inter"
              />
            </div>

            {error && <p className="text-red-500 text-sm sm:text-base font-inter">{error}</p>}
            {success && <p className="text-green-500 text-sm sm:text-base font-inter">{success}</p>}

            <motion.button
              type="submit"
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              className="w-full bg-amber-400 text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-amber-500 transition duration-300 font-inter"
            >
              Зарегистрироваться
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default Register;