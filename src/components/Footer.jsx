import { FaInstagram, FaTelegram } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-gray-50 shadow-sm py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-center items-center md:items-start space-y-6 md:space-y-0 md:space-x-12 flex-wrap">
          {/* Контакты */}
          <div className="text-center">
            <h3 className="text-gray-900 text-lg sm:text-xl font-semibold mb-3 font-manrope">
              Контакты
            </h3>
            <p className="text-gray-600 text-sm sm:text-base font-inter mb-2">
              Email:{' '}
              <a
                href="mailto:support@shtrafoff.ru"
                className="text-indigo-600 hover:text-indigo-500 transition duration-200"
              >
                support@shtrafoff.ru
              </a>
            </p>
            <p className="text-gray-600 text-sm sm:text-base font-inter">
              Телефон:{' '}
              <a
                href="tel:+79991234567"
                className="text-indigo-600 hover:text-indigo-500 transition duration-200"
              >
                +7 (999) 123-45-67
              </a>
            </p>
          </div>

          {/* Социальные сети */}
          <div className="text-center">
            <h3 className="text-gray-900 text-lg sm:text-xl font-semibold mb-3 font-manrope">
              Мы в соцсетях
            </h3>
            <div className="flex justify-center space-x-4">
              <a
                href="https://instagram.com/shtrafoff"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-500 transition duration-200 transform hover:scale-110"
              >
                <FaInstagram className="w-6 h-6 sm:w-8 sm:h-8" />
              </a>
              <a
                href="https://t.me/shtrafoff"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-500 transition duration-200 transform hover:scale-110"
              >
                <FaTelegram className="w-6 h-6 sm:w-8 sm:h-8" />
              </a>
            </div>
          </div>

          {/* Копирайт */}
          <div className="text-center">
            <p className="text-gray-600 text-sm sm:text-base font-inter">
              © 2025 Shtrafoff. Все права защищены.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;