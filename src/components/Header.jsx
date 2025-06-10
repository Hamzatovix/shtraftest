import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('isAuthenticated'));
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('userRole') === 'admin');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(localStorage.getItem('isAuthenticated') === 'true');
      setIsAdmin(localStorage.getItem('userRole') === 'admin');
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    try {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userRole');
      setIsAuthenticated(false);
      setIsAdmin(false);
      navigate('/');
      setIsOpen(false);
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  const linkVariants = {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  return (
    <header className="bg-white bg-opacity-90 backdrop-blur-md sticky top-0 z-50 shadow-md">
      <nav className="w-full max-w-7xl mx-auto flex justify-between items-center p-4 sm:p-6">
        <div className="text-xl sm:text-2xl font-bold text-indigo-600 font-manrope">
          <NavLink
            to="/"
            onClick={() => navigate('/')}
            aria-label="Перейти на главную"
          >
            штрафа.нет
          </NavLink>
        </div>
        <div className="sm:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-600 text-xl focus:outline-none"
            aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="sm:hidden flex flex-col absolute top-16 left-0 w-full bg-white p-4 shadow-lg"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <ul className="flex flex-col space-y-4 text-center">
                <motion.li variants={linkVariants}>
                  <NavLink
                    to="/about"
                    className={({ isActive }) => `text-sm font-medium text-gray-600 hover:text-indigo-600 ${isActive ? 'text-indigo-600' : ''}`}
                    onClick={() => setIsOpen(false)}
                    aria-label="Перейти на страницу О нас"
                  >
                    О нас
                  </NavLink>
                </motion.li>
                <motion.li variants={linkVariants}>
                  <NavLink
                    to="/submit-complaint"
                    className={({ isActive }) => `text-sm font-medium text-gray-600 hover:text-indigo-600 ${isActive ? 'text-indigo-600' : ''}`}
                    onClick={() => setIsOpen(false)}
                    aria-label="Перейти к подаче жалобы"
                  >
                    Подать жалобу
                  </NavLink>
                </motion.li>
                <motion.li variants={linkVariants}>
                  <NavLink
                    to="/my-complaints"
                    className={({ isActive }) => `text-sm font-medium text-gray-600 hover:text-indigo-600 ${isActive ? 'text-indigo-600' : ''}`}
                    onClick={() => setIsOpen(false)}
                    aria-label="Перейти к моим жалобам"
                  >
                    Мои жалобы
                  </NavLink>
                </motion.li>
                {isAdmin && (
                  <motion.li variants={linkVariants}>
                    <NavLink
                      to="/admin"
                      className={({ isActive }) => `text-sm font-medium text-gray-600 hover:text-indigo-600 ${isActive ? 'text-indigo-600' : ''}`}
                      onClick={() => setIsOpen(false)}
                      aria-label="Перейти в админ-панель"
                    >
                      Админ-панель
                    </NavLink>
                  </motion.li>
                )}
              </ul>
              <div className="flex flex-col mt-6 space-y-3 text-center">
                {isAuthenticated ? (
                  <NavLink
                    to="/profile"
                    className="inline-flex items-center justify-center bg-amber-400 text-gray-900 px-3 py-2 rounded-lg font-semibold hover:bg-amber-500"
                    onClick={() => setIsOpen(false)}
                    aria-label="Перейти в мой кабинет"
                  >
                    <FaUser className="mr-1" /> Мой кабинет
                  </NavLink>
                ) : (
                  <NavLink
                    to="/register"
                    className="inline-flex items-center justify-center bg-amber-400 text-gray-900 px-3 py-2 rounded-lg font-semibold hover:bg-amber-500"
                    onClick={() => setIsOpen(false)}
                    aria-label="Перейти к регистрации"
                  >
                    <FaUserPlus className="mr-1" /> Регистрация
                  </NavLink>
                )}
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center border border-gray-900 text-gray-900 px-3 py-2 rounded-lg font-semibold hover:bg-gray-100"
                    aria-label="Выйти из аккаунта"
                  >
                    <FaSignOutAlt className="mr-1" /> Выйти
                  </button>
                ) : (
                  <NavLink
                    to="/login"
                    className="inline-flex items-center justify-center border border-gray-900 text-gray-900 px-3 py-2 rounded-lg font-semibold hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                    aria-label="Войти в аккаунт"
                  >
                    <FaSignInAlt className="mr-1" /> Войти
                  </NavLink>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="hidden sm:flex sm:items-center sm:space-x-6">
          <ul className="flex space-x-6">
            <motion.li variants={linkVariants}>
              <NavLink
                to="/about"
                className={({ isActive }) => `text-base font-medium text-gray-600 hover:text-indigo-600 ${isActive ? 'text-indigo-600' : ''}`}
                aria-label="Перейти на страницу О нас"
              >
                О нас
              </NavLink>
            </motion.li>
            <motion.li variants={linkVariants}>
              <NavLink
                to="/submit-complaint"
                className={({ isActive }) => `text-base font-medium text-gray-600 hover:text-indigo-600 ${isActive ? 'text-indigo-600' : ''}`}
                aria-label="Перейти к подаче жалобы"
              >
                Подать жалобу
              </NavLink>
            </motion.li>
            <motion.li variants={linkVariants}>
              <NavLink
                to="/my-complaints"
                className={({ isActive }) => `text-base font-medium text-gray-600 hover:text-indigo-600 ${isActive ? 'text-indigo-600' : ''}`}
                aria-label="Перейти к моим жалобам"
              >
                Мои жалобы
              </NavLink>
            </motion.li>
            {isAdmin && (
              <motion.li variants={linkVariants}>
                <NavLink
                  to="/admin"
                  className={({ isActive }) => `text-base font-medium text-gray-600 hover:text-indigo-600 ${isActive ? 'text-indigo-600' : ''}`}
                  aria-label="Перейти в админ-панель"
                >
                  Админ-панель
                </NavLink>
              </motion.li>
            )}
          </ul>
          <div className="flex space-x-4 ml-6">
            {isAuthenticated ? (
              <NavLink
                to="/profile"
                className="inline-flex items-center justify-center bg-amber-400 text-gray-900 px-3 py-2 rounded-lg font-semibold hover:bg-amber-500"
                aria-label="Перейти в мой кабинет"
              >
                <FaUser className="mr-1" /> Мой кабинет
              </NavLink>
            ) : (
              <NavLink
                to="/register"
                className="inline-flex items-center justify-center bg-amber-400 text-gray-900 px-3 py-2 rounded-lg font-semibold hover:bg-amber-500"
                aria-label="Перейти к регистрации"
              >
                <FaUserPlus className="mr-1" /> Регистрация
              </NavLink>
            )}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center border border-gray-900 text-gray-900 px-3 py-2 rounded-lg font-semibold hover:bg-gray-100"
                aria-label="Выйти из аккаунта"
              >
                <FaSignOutAlt className="mr-1" /> Выйти
              </button>
            ) : (
              <NavLink
                to="/login"
                className="inline-flex items-center justify-center border border-gray-900 text-gray-900 px-3 py-2 rounded-lg font-semibold hover:bg-gray-100"
                aria-label="Войти в аккаунт"
              >
                <FaSignInAlt className="mr-1" /> Войти
              </NavLink>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;