import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

function Home() {
  const [fineAmount, setFineAmount] = useState('');
  const [savings, setSavings] = useState(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [tooltip, setTooltip] = useState(null);

  const handleFineCalculation = () => {
    const amount = parseFloat(fineAmount);
    if (!isNaN(amount) && amount > 0) {
      const baseSavings = amount * 0.3; // 30% savings
      const commission = 50; // Fixed commission example
      const estimatedSavings = Math.max((baseSavings - commission).toFixed(2), 0); // Prevent negative savings
      setSavings(estimatedSavings);
    } else {
      setSavings(null);
    }
  };

  const heroVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const textVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.03 } },
  };

  const letterVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' },
  };

  const svgVariants = {
    initial: { scale: 0.8, rotate: -10 },
    animate: {
      scale: 1,
      rotate: 0,
      transition: { duration: 1, ease: 'easeOut', repeat: Infinity, repeatType: 'reverse' },
    },
  };

  const floatVariants = {
    animate: {
      y: [0, -10, 0],
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
    },
  };

  const waveVariants = {
    animate: {
      scale: [0.8, 1.1, 0.8],
      rotate: [0, 10, -10, 0],
      x: [0, 10, -10, 0],
      transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
    },
  };

  const stagger = {
    animate: { transition: { staggerChildren: 0.2 } },
  };

  const cardVariants = {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    hover: { scale: 1.03, boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)' },
  };

  const reviewVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    hover: { scale: 1.03 },
  };

  const starVariants = {
    initial: { opacity: 0, scale: 0 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  const calculatorSectionVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const heroTitle = 'Shtrafoff — ваш помощник в борьбе со штрафами';

  return (
    <div className="bg-gray-50 relative overflow-hidden">
      {/* Background Animations */}
      <motion.div
        className="absolute top-10 left-10 hidden md:block"
        variants={{ ...floatVariants, ...waveVariants }}
        animate="animate"
        transition={{ delay: 0.2 }}
      >
        <svg
          className="w-12 sm:w-16 text-indigo-200 opacity-50"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 12H8v-2h4v2zm0-4H8v-2h4v2zm0-4H8V6h4v2zm6 8h-4v-2h4v2zm0-4h-4v-2h4v2zm0-4h-4V6h4v2z" />
        </svg>
      </motion.div>
      <motion.div
        className="absolute top-10 right-10 hidden md:block"
        variants={{ ...floatVariants, ...waveVariants }}
        animate="animate"
        transition={{ delay: 0.4 }}
      >
        <svg
          className="w-12 sm:w-16 text-amber-200 opacity-50"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4zm0 15l3-3.86 2.14 2.58 3-3.86L18 19H6z" />
        </svg>
      </motion.div>
      <motion.div
        className="absolute bottom-10 left-10 hidden md:block"
        variants={{ ...floatVariants, ...waveVariants }}
        animate="animate"
        transition={{ delay: 0.6 }}
      >
        <svg
          className="w-12 sm:w-16 text-indigo-300 opacity-50"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14h-2v6l5.25 3.15.75-1.23-4.5-2.67V6z" />
        </svg>
      </motion.div>
      <motion.div
        className="absolute bottom-10 right-10 hidden md:block"
        variants={{ ...floatVariants, ...waveVariants }}
        animate="animate"
        transition={{ delay: 0.8 }}
      >
        <svg
          className="w-12 sm:w-16 text-amber-300 opacity-50"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      </motion.div>

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center text-center bg-gradient-to-b from-indigo-50 to-gray-50">
        <div className="w-full max-w-7xl mx-auto p-6 sm:p-8 relative">
          <motion.div className="max-w-4xl mx-auto" initial="initial" animate="animate" variants={heroVariants}>
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 sm:mb-8 font-manrope"
              variants={textVariants}
            >
              {heroTitle.split('').map((char, index) => (
                <motion.span key={index} variants={letterVariants}>
                  {char}
                </motion.span>
              ))}
            </motion.h1>
            <motion.p
              className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-10 font-inter"
              variants={heroVariants}
            >
              Быстро и просто обжалуйте штрафы онлайн. Наши юристы помогут вам добиться справедливости.
            </motion.p>
            <motion.div
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              onHoverStart={() => setIsButtonHovered(true)}
              onHoverEnd={() => setIsButtonHovered(false)}
              className="relative inline-block"
            >
              <Link
                to="/submit-complaint"
                className="inline-flex items-center bg-amber-400 text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-amber-500 transition duration-300 font-inter"
                aria-label="Подать жалобу на штраф"
              >
                Подать жалобу
              </Link>
            </motion.div>
          </motion.div>
          <motion.div
            className="absolute bottom-8 right-8 hidden md:block"
            variants={svgVariants}
            initial="initial"
            animate="animate"
          >
            <svg
              className="w-16 sm:w-20 text-indigo-600"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2L2 7v10l10 5 10-5V7l-10-5zm0 2.24L18.76 7 12 9.76 5.24 7 12 4.24zM4 8.76V16.24L10.76 19 4 16.24V8.76zm11.24 10L12 16.76 8.76 19 12 20.24l3.24-1.48zM20 16.24L13.24 19V11.52L20 8.76v7.48z" />
            </svg>
          </motion.div>
        </div>
      </section>

      {/* Steps Section */}
      <motion.section
        className="py-12 sm:py-16 bg-white"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={stagger}
      >
        <div className="w-full max-w-7xl mx-auto p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8 sm:mb-12 text-center font-manrope">
            Как это работает
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: '1. Заполните форму',
                description: 'Укажите данные штрафа и опишите ситуацию.',
                icon: (
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                  </svg>
                ),
                tooltip: 'Форма занимает всего 2 минуты!',
              },
              {
                title: '2. Прикрепите документы',
                description: 'Добавьте фото штрафа или другие файлы.',
                icon: (
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z" />
                  </svg>
                ),
                tooltip: 'Поддерживаем PDF и изображения.',
              },
              {
                title: '3. Получите результат',
                description: 'Наши юристы обработают жалобу и свяжутся с вами.',
                icon: (
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                ),
                tooltip: 'Среднее время ответа — 24 часа.',
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="relative bg-gray-50 p-6 sm:p-8 rounded-lg shadow-sm hover:shadow-md transition duration-300 text-center cursor-pointer"
                variants={cardVariants}
                whileHover="hover"
                onClick={() => setTooltip(tooltip === index ? null : index)}
              >
                <motion.div
                  className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  whileHover={{ scale: 1.1 }}
                >
                  {step.icon}
                </motion.div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 font-inter">{step.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base font-inter">{step.description}</p>
                <AnimatePresence>
                  {tooltip === index && (
                    <motion.div
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-indigo-600 text-white text-xs sm:text-sm p-2 rounded-lg shadow-lg"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      {step.tooltip}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Calculator Section */}
      <motion.section
        className="py-12 sm:py-16 bg-gray-50 relative overflow-hidden"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={stagger}
      >
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full opacity-20" viewBox="0 0 1440 600" preserveAspectRatio="none">
            <path
              d="M0 300 C200 350, 400 250, 600 300 S1000 350, 1200 300, 1440 350"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="text-indigo-200"
            >
              <animate
                attributeName="d"
                values="
                  M0 300 C200 350, 400 250, 600 300 S1000 350, 1200 300, 1440 350;
                  M0 350 C200 300, 400 300, 600 350 S1000 300, 1200 350, 1440 300;
                  M0 300 C200 350, 400 250, 600 300 S1000 350, 1200 300, 1440 350"
                dur="10s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </div>
        <div className="w-full max-w-7xl mx-auto p-6 sm:p-8 text-center">
          <motion.div variants={calculatorSectionVariants}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 font-manrope">
              Рассчитайте экономию
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto font-inter">
              Узнайте, сколько вы можете сэкономить, обжаловав штраф с Shtrafoff. Введите сумму штрафа и получите примерный расчёт.
            </p>
            <motion.div
              className="max-w-md mx-auto space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  placeholder="Сумма штрафа (₽)"
                  value={fineAmount}
                  onChange={(e) => setFineAmount(e.target.value)}
                  min="0"
                  className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-sm sm:text-base font-inter"
                  aria-label="Введите сумму штрафа в рублях"
                />
                <button
                  onClick={handleFineCalculation}
                  className="bg-amber-400 text-gray-900 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-amber-500 transition duration-300 text-sm sm:text-base font-inter"
                  aria-label="Рассчитать экономию"
                >
                  Рассчитать
                </button>
              </div>
              {savings !== null && (
                <motion.p
                  className="text-white bg-indigo-600 p-2 sm:p-3 rounded-lg text-sm sm:text-base font-inter"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Примерная экономия: {savings} ₽
                </motion.p>
              )}
            </motion.div>
            <motion.div className="mt-8 inline-block" variants={svgVariants} initial="initial" animate="animate">
              <svg
                className="w-12 sm:w-16 text-indigo-600 mx-auto"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M11 2H9v3h2V2zm4.242.758l-2.121 2.121 2.122 2.122 2.121-2.122-2.122-2.121zM19 9v2h3V9h-3zm-1.758 4.242l-2.121-2.122-2.122 2.122 2.122 2.121 2.121-2.121zM11 16H9v3h2v-3zm-4.242-1.758l-2.122-2.121-2.121 2.122 2.122 2.121 2.121-2.122zM2 11V9h3v2H2zm4.242-4.242l-2.121-2.122-2.122 2.122 2.122 2.121 2.121-2.121zM7 12c0-2.757 2.243-5 5-5s5 2.243 5 5-2.243 5-5 5-5-2.243-5-5zm2 0c0 1.654 1.346 3 3 3s3-1.346 3-3-1.346-3-3-3-3 1.346-3 3z" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Reviews Section */}
      <motion.section
        className="py-12 sm:py-16 bg-gray-50"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={stagger}
      >
        <div className="w-full max-w-7xl mx-auto p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8 sm:mb-12 text-center font-manrope">
            Отзывы клиентов
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                name: 'Анна К.',
                initial: 'А',
                review: 'Shtrafoff помог оспорить штраф за 3 дня! Всё просто и понятно.',
              },
              {
                name: 'Михаил С.',
                initial: 'М',
                review: 'Удобный сервис, юристы оперативно ответили. Рекомендую!',
              },
              {
                name: 'Елена П.',
                initial: 'Е',
                review: 'Спасибо за быструю помощь в обжаловании штрафа!',
              },
            ].map((review, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 sm:p-8 rounded-lg shadow-sm hover:shadow-md transition duration-300"
                variants={reviewVariants}
                whileHover="hover"
              >
                <div className="flex items-center mb-4">
                  <motion.div
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-3"
                    whileHover={{ backgroundColor: '#E0E7FF' }}
                  >
                    <span className="text-indigo-600 font-semibold text-lg font-inter">{review.initial}</span>
                  </motion.div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.div
                        key={star}
                        variants={starVariants}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: index * 0.1 + star * 0.1 }}
                      >
                        <FaStar className="text-amber-400 text-base sm:text-lg mr-1" />
                      </motion.div>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4 text-sm sm:text-base font-inter">{review.review}</p>
                <p className="text-gray-900 font-semibold text-sm sm:text-base font-inter">{review.name}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <a
              href="#reviews"
              className="inline-block text-indigo-600 hover:text-indigo-700 font-semibold text-sm sm:text-base transition duration-300 font-inter"
              aria-label="Читать все отзывы клиентов"
            >
              Читать все отзывы
            </a>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

export default Home;