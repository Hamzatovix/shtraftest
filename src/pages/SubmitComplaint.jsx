import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaBuilding, FaUpload } from 'react-icons/fa';

function SubmitComplaint() {
  const [userType, setUserType] = useState('individual');
  const [formData, setFormData] = useState({
    name: '',
    inn: '',
    email: '',
    phone: '',
    description: '',
    photo: null,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Проверка размера файла (максимум 5 МБ)
      if (file.size > 5 * 1024 * 1024) {
        setError('Файл слишком большой. Максимальный размер — 5 МБ.');
        return;
      }
      // Проверка формата файла
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setError('Недопустимый формат файла. Используйте JPEG, PNG или PDF.');
        return;
      }
      setFormData({ ...formData, photo: file });
      setError('');
    }
  };

  const validateForm = () => {
    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return 'Введите корректный email.';
    }

    // Валидация телефона (пример для российского номера)
    const phoneRegex = /^(\+7|8)\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      return 'Введите корректный номер телефона (например, +79991234567).';
    }

    // Валидация ИНН для юрлиц
    if (userType === 'legal') {
      const innRegex = /^\d{10}$|^\d{12}$/;
      if (!innRegex.test(formData.inn)) {
        return 'ИНН должен содержать 10 или 12 цифр.';
      }
    }

    // Проверка обязательных полей
    if (!formData.name || !formData.email || !formData.phone || !formData.description) {
      return 'Заполните все обязательные поля.';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    // Валидация формы
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsSubmitting(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Необходимо войти в систему.');
      setIsSubmitting(false);
      return;
    }

    const data = new FormData();
    data.append('userType', userType);
    data.append('name', formData.name);
    data.append('inn', formData.inn);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('description', formData.description);
    if (formData.photo) {
      data.append('photo', formData.photo);
    }

    try {
      const response = await fetch('http://localhost:5000/api/complaints', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await response.json();
      if (response.ok) {
        setSuccess(result.message || 'Жалоба успешно отправлена!');
        setFormData({
          name: '',
          inn: '',
          email: '',
          phone: '',
          description: '',
          photo: null,
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // Сбрасываем input file
        }
      } else {
        setError(result.message || 'Ошибка при отправке жалобы.');
      }
    } catch (err) {
      setError('Ошибка при отправке жалобы: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeInVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' },
  };

  return (
    <div className="bg-gray-50 min-h-[80vh] flex flex-col items-center justify-center py-12 sm:py-16">
      <div className="w-full max-w-2xl mx-auto p-6 sm:p-8">
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 sm:mb-8 text-center font-manrope"
          initial="initial"
          animate="animate"
          variants={fadeInVariants}
        >
          Подать жалобу
        </motion.h1>

        <motion.div
          className="bg-white p-6 sm:p-8 rounded-lg shadow-sm"
          initial="initial"
          animate="animate"
          variants={fadeInVariants}
        >
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => setUserType('individual')}
              className={`flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base font-inter transition duration-300 ${
                userType === 'individual'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
              aria-label="Выбрать тип пользователя: Физическое лицо"
              disabled={isSubmitting}
            >
              <FaUser className="mr-2" />
              Физическое лицо
            </button>
            <button
              onClick={() => setUserType('legal')}
              className={`flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base font-inter transition duration-300 ${
                userType === 'legal'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
              aria-label="Выбрать тип пользователя: Юридическое лицо"
              disabled={isSubmitting}
            >
              <FaBuilding className="mr-2" />
              Юридическое лицо
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-gray-900 font-semibold mb-1 font-inter">
                {userType === 'individual' ? 'ФИО' : 'Наименование организации'}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-sm sm:text-base font-inter"
                required
                aria-label={userType === 'individual' ? 'Введите ваше ФИО' : 'Введите наименование организации'}
              />
            </div>

            {userType === 'legal' && (
              <div>
                <label className="block text-gray-900 font-semibold mb-1 font-inter">ИНН</label>
                <input
                  type="text"
                  name="inn"
                  value={formData.inn}
                  onChange={handleInputChange}
                  className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-sm sm:text-base font-inter"
                  required
                  aria-label="Введите ИНН организации"
                />
              </div>
            )}

            <div>
              <label className="block text-gray-900 font-semibold mb-1 font-inter">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-sm sm:text-base font-inter"
                required
                aria-label="Введите ваш email"
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
                required
                aria-label="Введите ваш номер телефона"
              />
            </div>

            <div>
              <label className="block text-gray-900 font-semibold mb-1 font-inter">Описание нарушения</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-sm sm:text-base font-inter"
                rows="4"
                required
                aria-label="Опишите нарушение"
              />
            </div>

            <div>
              <label className="block text-gray-900 font-semibold mb-1 font-inter">Фото штрафа</label>
              <label
                className="flex items-center justify-center w-full p-2 sm:p-3 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-600 transition duration-300"
                htmlFor="photo-upload"
              >
                <FaUpload className="text-indigo-600 mr-2" />
                <span className="text-gray-600 text-sm sm:text-base font-inter">
                  {formData.photo ? formData.photo.name : 'Выберите файл (JPEG, PNG, PDF)'}
                </span>
                <input
                  id="photo-upload"
                  type="file"
                  name="photo"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/jpeg,image/png,application/pdf"
                  ref={fileInputRef}
                  aria-label="Загрузите фото штрафа (JPEG, PNG, PDF)"
                />
              </label>
            </div>

            {error && (
              <motion.p
                className="text-red-500 text-sm sm:text-base font-inter"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.p>
            )}
            {success && (
              <motion.p
                className="text-green-500 text-sm sm:text-base font-inter"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {success}
              </motion.p>
            )}

            <motion.button
              type="submit"
              variants={buttonVariants}
              whileHover="hover"
              className={`w-full bg-amber-400 text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition duration-300 font-inter ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-amber-500'
              }`}
              disabled={isSubmitting}
              aria-label="Отправить жалобу"
            >
              {isSubmitting ? 'Отправка...' : 'Отправить жалобу'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default SubmitComplaint;