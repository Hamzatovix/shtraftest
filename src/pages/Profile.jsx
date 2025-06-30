// src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUserEdit, FaSave, FaUserCircle } from 'react-icons/fa';

function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    setError('');

    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    if (!token || !storedUser || Object.keys(storedUser).length === 0) {
      const dummyUser = {
        fullName: 'Иван Иванов',
        email: 'ivan@example.com',
        registrationDate: new Date().toLocaleDateString('ru-RU'),
        lastLogin: new Date().toLocaleDateString('ru-RU'),
        avatar: 'https://via.placeholder.com/150', // Заглушка для аватара
      };
      localStorage.setItem('user', JSON.stringify(dummyUser));
      localStorage.setItem('token', 'fake-token-123');
      setUser(dummyUser);
      setEditedUser({ ...dummyUser });
    } else {
      const updatedUser = {
        ...storedUser,
        lastLogin: storedUser.lastLogin || new Date().toLocaleDateString('ru-RU'),
        avatar: storedUser.avatar || 'https://via.placeholder.com/150',
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setEditedUser({ ...updatedUser });
    }

    setIsLoading(false);
  }, [navigate]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editedUser.fullName || !editedUser.email) {
      setError('Имя и email обязательны для заполнения');
      return;
    }
    setUser({ ...editedUser });
    localStorage.setItem('user', JSON.stringify(editedUser));
    setIsEditing(false);
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center py-12 sm:py-16 bg-gradient-to-b from-gray-100 to-gray-200">
      <div className="w-full max-w-2xl mx-auto p-6 sm:p-8">
        <motion.div initial="initial" animate="animate" variants={{ initial: { opacity: 0 }, animate: { opacity: 1, transition: { duration: 0.8 } } }}>
          <motion.h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white bg-blue-900 p-4 rounded-lg text-center">
            Профиль пользователя
          </motion.h1>
          {isLoading ? (
            <p className="text-lg font-inter text-center text-gray-600">Загрузка...</p>
          ) : error ? (
            <p className="text-lg font-inter mb-4 text-center text-red-500">{error}</p>
          ) : user ? (
            <AnimatePresence>
              <motion.div
                key="profile-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="p-6 bg-white rounded-xl shadow-lg border border-gray-200"
              >
                <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-6 mb-6">
                  <div className="relative">
                    <motion.img
                      src={user.avatar}
                      alt="" // Убрана надпись "Аватар пользователя"
                      className="w-24 h-24 rounded-full object-cover border-4 border-indigo-500"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <FaUserCircle className="absolute top-0 left-0 w-24 h-24 text-gray-300 opacity-50" />
                  </div>
                  <div className="w-full">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-inter text-gray-700 mb-2">Имя</label>
                          <input
                            type="text"
                            name="fullName"
                            value={editedUser.fullName}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 bg-white text-black"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-inter text-gray-700 mb-2">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={editedUser.email}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 bg-white text-black"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-lg font-inter text-gray-600">Имя: {user.fullName}</p>
                        <p className="text-lg font-inter text-gray-600">Email: {user.email}</p>
                        <p className="text-lg font-inter text-gray-600">Дата регистрации: {user.registrationDate}</p>
                        <p className="text-lg font-inter text-gray-600">Последний вход: {user.lastLogin}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="border-t border-gray-200 mt-6 pt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Настройки</h3>
                  <p className="text-md text-gray-500">Смена пароля и уведомления будут доступны позже.</p>
                </div>
                <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
                  {!isEditing ? (
                    <motion.button
                      className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center"
                      onClick={handleEdit}
                    >
                      <FaUserEdit className="mr-2" /> Редактировать
                    </motion.button>
                  ) : (
                    <motion.button
                      className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center"
                      onClick={handleSave}
                    >
                      <FaSave className="mr-2" /> Сохранить
                    </motion.button>
                  )}
                  <motion.button
                    className="flex-1 bg-amber-400 text-gray-900 px-6 py-3 rounded-lg font-semibold flex items-center justify-center"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="mr-2" /> Выйти
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : null}
        </motion.div>
      </div>
    </div>
  );
}

export default Profile;