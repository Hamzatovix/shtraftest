import { motion } from 'framer-motion';
import { FaUsers, FaEnvelope, FaPhone } from 'react-icons/fa';

function About() {
  const fadeInVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="bg-gray-50 min-h-[80vh] flex flex-col items-center justify-center py-12 sm:py-16">
      <div className="w-full max-w-7xl mx-auto p-6 sm:p-8">
        <motion.div
          initial="initial"
          animate="animate"
          variants={stagger}
        >
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 sm:mb-8 text-center font-manrope"
            variants={fadeInVariants}
          >
            О нас
          </motion.h1>
          <motion.p
            className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto text-center font-inter"
            variants={fadeInVariants}
          >
            Shtrafoff — это сервис, созданный для помощи автовладельцам в обжаловании штрафов. Наша миссия — сделать процесс простым, прозрачным и доступным для каждого.
          </motion.p>
          <motion.p
            className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto text-center font-inter"
            variants={fadeInVariants}
          >
            Мы объединяем опытных юристов и современные технологии, чтобы вы могли сэкономить время и деньги.
          </motion.p>

          <motion.h2
            className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-center font-manrope"
            variants={fadeInVariants}
          >
            О нашей команде
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center"
            variants={stagger}
          >
            <motion.div
              className="bg-white p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition duration-300"
              variants={fadeInVariants}
            >
              <FaUsers className="w-12 h-12 sm:w-16 sm:h-16 text-indigo-600 mx-auto mb-2" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 font-inter">Команда</h3>
              <p className="text-gray-600 text-sm sm:text-base font-inter">Профессионалы своего дела</p>
            </motion.div>
            <motion.div
              className="bg-white p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition duration-300"
              variants={fadeInVariants}
            >
              <FaEnvelope className="w-12 h-12 sm:w-16 sm:h-16 text-indigo-600 mx-auto mb-2" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 font-inter">Поддержка</h3>
              <p className="text-gray-600 text-sm sm:text-base font-inter">support@shtrafoff.ru</p>
            </motion.div>
            <motion.div
              className="bg-white p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition duration-300"
              variants={fadeInVariants}
            >
              <FaPhone className="w-12 h-12 sm:w-16 sm:h-16 text-indigo-600 mx-auto mb-2" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 font-inter">Телефон</h3>
              <p className="text-gray-600 text-sm sm:text-base font-inter">+7 (999) 123-45-67</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default About;