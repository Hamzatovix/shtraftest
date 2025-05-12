import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { decodeJwt } from 'jose';

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = decodeJwt(token);
          setIsAuthenticated(true);
          setIsAdmin(decoded.role === 'admin');
        } catch (error) {
          console.error('Ошибка декодирования токена:', error);
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    };

    checkAuth();
    // Добавляем обработчик события для случаев, если токен изменится (например, при входе на другой вкладке)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setIsAdmin(false);
    navigate('/login');
    setIsOpen(false);
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  const linkVariants = {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    hover: { scale: 1.05 },
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' },
  };

  return (
    <header className="bg-white bg-opacity-90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <nav className="w-full max-w-7xl mx-auto flex justify-between items-center p-4 sm:p-6">
        <div className="text-xl sm:text-2xl font-bold text-indigo-600 flex items-center font-manrope">
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-amber-400"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2L2 7v10l10 5 10-5V7l-10-5zm0 2.24L18.76 7 12 9.76 5.24 7 12 4.24zM4 8.76V16.24L10.76 19 4 16.24V8.76zm11.24 10L12 16.76 8.76 19 12 20.24l3.24-1.48zM20 16.24L13.24 19V11.52L20 8.76v7.48z" />
          </svg>
          <NavLink to="/">Shtrafoff</NavLink>
        </div>
        <div className="sm:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-600 text-xl"
            aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="sm:hidden flex flex-col absolute top-14 left-0 w-full bg-white p-4 shadow-md"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <ul className="flex flex-col space-y-4 text-center">
                <motion.li variants={linkVariants} initial="initial" animate="animate" whileHover="hover">
                  <NavLink
                    to="/about"
                    className={({ isActive }) =>
                      `text-sm sm:text-base font-medium text-gray-600 hover:text-indigo-600 transition duration-200 ${
                        isActive ? 'text-indigo-600' : ''
                      }`
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    О нас
                  </NavLink>
                </motion.li>
                <motion.li variants={linkVariants} initial="initial" animate="animate" whileHover="hover">
                  <NavLink
                    to="/submit-complaint"
                    className={({ isActive }) =>
                      `text-sm sm:text-base font-medium text-gray-600 hover:text-indigo-600 transition duration-200 ${
                        isActive ? 'text-indigo-600' : ''
                      }`
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    Подать жалобу
                  </NavLink>
                </motion.li>
                <motion.li variants={linkVariants} initial="initial" animate="animate" whileHover="hover">
                  <NavLink
                    to="/my-complaints"
                    className={({ isActive }) =>
                      `text-sm sm:text-base font-medium text-gray-600 hover:text-indigo-600 transition duration-200 ${
                        isActive ? 'text-indigo-600' : ''
                      }`
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    Мои жалобы
                  </NavLink>
                </motion.li>
                {isAdmin && (
                  <motion.li variants={linkVariants} initial="initial" animate="animate" whileHover="hover">
                    <NavLink
                      to="/admin"
                      className={({ isActive }) =>
                        `text-sm sm:text-base font-medium text-gray-600 hover:text-indigo-600 transition duration-200 ${
                          isActive ? 'text-indigo-600' : ''
                        }`
                      }
                      onClick={() => setIsOpen(false)}
                    >
                      Админ-панель
                    </NavLink>
                  </motion.li>
                )}
              </ul>
              <div className="flex flex-col mt-4 space-y-4 text-center">
                <motion.div variants={buttonVariants} whileHover="hover">
                  {isAuthenticated ? (
                    <NavLink
                      to="/profile"
                      className="inline-flex items-center justify-center bg-amber-400 text-gray-900 px-3 py-2 rounded-lg font-semibold hover:bg-amber-500 transition duration-300 text-sm sm:text-base font-inter"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaUser className="mr-1" />
                      Мой кабинет
                    </NavLink>
                  ) : (
                    <NavLink
                      to="/register"
                      className="inline-flex items-center justify-center bg-amber-400 text-gray-900 px-3 py-2 rounded-lg font-semibold hover:bg-amber-500 transition duration-300 text-sm sm:text-base font-inter"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaUserPlus className="mr-1" />
                      Регистрация
                    </NavLink>
                  )}
                </motion.div>
                <motion.div variants={buttonVariants} whileHover="hover">
                  {isAuthenticated ? (
                    <button
                      onClick={handleLogout}
                      className="inline-flex items-center justify-center border border-gray-900 text-gray-900 px-3 py-2 rounded-lg font-semibold hover:bg-gray-100 transition duration-300 text-sm sm:text-base font-inter"
                      aria-label="Выйти из аккаунта"
                    >
                      <FaSignOutAlt className="mr-1" />
                      Выйти
                    </button>
                  ) : (
                    <NavLink
                      to="/login"
                      className="inline-flex items-center justify-center border border-gray-900 text-gray-900 px-3 py-2 rounded-lg font-semibold hover:bg-gray-100 transition duration-300 text-sm sm:text-base font-inter"
                      onClick={() => setIsOpen(false)}
                      aria-label="Войти в аккаунт"
                    >
                      <FaSignInAlt className="mr-1" />
                      Войти
                    </NavLink>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="hidden sm:flex sm:items-center sm:space-x-8">
          <ul className="flex space-x-8">
            <motion.li variants={linkVariants} initial="initial" animate="animate" whileHover="hover">
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `text-base font-medium text-gray-600 hover:text-indigo-600 transition duration-200 font-inter ${
                    isActive ? 'text-indigo-600' : ''
                  }`
                }
              >
                О нас
              </NavLink>
            </motion.li>
            <motion.li variants={linkVariants} initial="initial" animate="animate" whileHover="hover">
              <NavLink
                to="/submit-complaint"
                className={({ isActive }) =>
                  `text-base font-medium text-gray-600 hover:text-indigo-600 transition duration-200 font-inter ${
                    isActive ? 'text-indigo-600' : ''
                  }`
                }
              >
                Подать жалобу
              </NavLink>
            </motion.li>
            <motion.li variants={linkVariants} initial="initial" animate="animate" whileHover="hover">
              <NavLink
                to="/my-complaints"
                className={({ isActive }) =>
                  `text-base font-medium text-gray-600 hover:text-indigo-600 transition duration-200 font-inter ${
                    isActive ? 'text-indigo-600' : ''
                  }`
                }
              >
                Мои жалобы
              </NavLink>
            </motion.li>
            {isAdmin && (
              <motion.li variants={linkVariants} initial="initial" animate="animate" whileHover="hover">
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `text-base font-medium text-gray-600 hover:text-indigo-600 transition duration-200 font-inter ${
                      isActive ? 'text-indigo-600' : ''
                    }`
                  }
                >
                  Админ-панель
                </NavLink>
              </motion.li>
            )}
          </ul>
          <div className="flex space-x-6 ml-8">
            <motion.div variants={buttonVariants} whileHover="hover">
              {isAuthenticated ? (
                <NavLink
                  to="/profile"
                  className="inline-flex items-center justify-center bg-amber-400 text-gray-900 px-3 py-2 rounded-lg font-semibold hover:bg-amber-500 transition duration-300 text-base font-inter"
                  aria-label="Перейти в мой кабинет"
                >
                  <FaUser className="mr-1" />
                  Мой кабинет
                </NavLink>
              ) : (
                <NavLink
                  to="/register"
                  className="inline-flex items-center justify-center bg-amber-400 text-gray-900 px-3 py-2 rounded-lg font-semibold hover:bg-amber-500 transition duration-300 text-base font-inter"
                  aria-label="Перейти к регистрации"
                >
                  <FaUserPlus className="mr-1" />
                  Регистрация
                </NavLink>
              )}
            </motion.div>
            <motion.div variants={buttonVariants} whileHover="hover">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center border border-gray-900 text-gray-900 px-3 py-2 rounded-lg font-semibold hover:bg-gray-100 transition duration-300 text-base font-inter"
                  aria-label="Выйти из аккаунта"
                >
                  <FaSignOutAlt className="mr-1" />
                  Выйти
                </button>
              ) : (
                <NavLink
                  to="/login"
                  className="inline-flex items-center justify-center border border-gray-900 text-gray-900 px-3 py-2 rounded-lg font-semibold hover:bg-gray-100 transition duration-300 text-base font-inter"
                  aria-label="Войти в аккаунт"
                  onClick={() => setIsOpen(false)}
                >
                  <FaSignInAlt className="mr-1" />
                  Войти
                </NavLink>
              )}
            </motion.div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;