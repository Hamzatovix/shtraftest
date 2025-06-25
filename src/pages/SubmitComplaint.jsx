import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaPhone, FaCalendarAlt, FaBuilding, FaClock, FaCar, FaCamera, FaCheck, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

function SubmitComplaint() {
  const [formData, setFormData] = useState({
    userType: 'individual', // 'individual' или 'legal'
    step: 1, // Используется только для физических лиц
    name: '',
    address: '',
    phone: '',
    resolutionNumber: '',
    resolutionDate: '',
    issuingAuthority: '',
    receivedDate: '',
    violationDate: '',
    violationTime: '',
    violationAddress: '',
    carModel: '',
    carPlate: '',
    detectionMethod: '',
    photo: null,
    agreement: false,
    terms: false,
    contractNumber: '',
    companyName: '',
    inn: '',
    violationDescription: '',
    receivedDetails: '',
    finePhoto: null,
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const finePhotoInputRef = useRef(null);

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    if (name === 'phone') {
      const phoneRegex = /^(\+7|8)\d{10}$/;
      newErrors.phone = phoneRegex.test(value) ? '' : 'Введите корректный номер телефона (например, +79991234567)';
    }
    if (name === 'carPlate') {
      const plateRegex = /^[АВЕКМНОРСТУХ]\d{3}[АВЕКМНОРСТУХ]{2}\d{2,3}$/;
      newErrors.carPlate = plateRegex.test(value) ? '' : 'Введите корректный госномер (например, А123ВС77)';
    }
    if (name === 'inn') {
      const innRegex = /^\d{10}$|^\d{12}$/;
      newErrors.inn = innRegex.test(value) ? '' : 'ИНН должен содержать 10 или 12 цифр';
    }
    if (name === 'photo' && value) {
      if (value.size > 5 * 1024 * 1024) {
        newErrors.photo = 'Файл слишком большой. Максимальный размер — 5 МБ.';
      } else {
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        newErrors.photo = allowedTypes.includes(value.type) ? '' : 'Недопустимый формат файла. Используйте JPEG, PNG или PDF.';
      }
    }
    if (name === 'finePhoto' && value) {
      if (value.size > 5 * 1024 * 1024) {
        newErrors.finePhoto = 'Файл слишком большой. Максимальный размер — 5 МБ.';
      } else {
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        newErrors.finePhoto = allowedTypes.includes(value.type) ? '' : 'Недопустимый формат файла. Используйте JPEG, PNG или PDF.';
      }
    }
    if (['name', 'address', 'resolutionNumber', 'resolutionDate', 'issuingAuthority', 'receivedDate', 'violationDate', 'violationTime', 'violationAddress', 'carModel', 'detectionMethod', 'companyName', 'contractNumber', 'inn', 'violationDescription', 'receivedDetails'].includes(name) && !value) {
      newErrors[name] = 'Это поле обязательно';
    }
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const validateIndividualStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.name) newErrors.name = 'Это поле обязательно';
      if (!formData.address) newErrors.address = 'Это поле обязательно';
      if (!formData.phone) newErrors.phone = 'Это поле обязательно';
      else validateField('phone', formData.phone);
    }
    if (step === 2) {
      if (!formData.resolutionNumber) newErrors.resolutionNumber = 'Это поле обязательно';
      if (!formData.resolutionDate) newErrors.resolutionDate = 'Это поле обязательно';
    }
    if (step === 3) {
      if (!formData.issuingAuthority) newErrors.issuingAuthority = 'Это поле обязательно';
      if (!formData.receivedDate) newErrors.receivedDate = 'Это поле обязательно';
    }
    if (step === 4) {
      if (!formData.violationDate) newErrors.violationDate = 'Это поле обязательно';
      if (!formData.violationTime) newErrors.violationTime = 'Это поле обязательно';
      if (!formData.violationAddress) newErrors.violationAddress = 'Это поле обязательно';
    }
    if (step === 5) {
      if (!formData.carModel) newErrors.carModel = 'Это поле обязательно';
      if (!formData.carPlate) newErrors.carPlate = 'Это поле обязательно';
      else validateField('carPlate', formData.carPlate);
      if (!formData.detectionMethod) newErrors.detectionMethod = 'Это поле обязательно';
    }
    if (step === 6) {
      if (!formData.photo) newErrors.photo = 'Это поле обязательно';
      else validateField('photo', formData.photo);
    }
    if (step === 7) {
      if (!formData.agreement) newErrors.agreement = 'Необходимо согласиться';
      if (!formData.terms) newErrors.terms = 'Необходимо согласиться';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateLegalForm = () => {
    const newErrors = {};
    if (!formData.contractNumber) newErrors.contractNumber = 'Это поле обязательно';
    if (!formData.companyName) newErrors.companyName = 'Это поле обязательно';
    if (!formData.inn) newErrors.inn = 'Это поле обязательно';
    else validateField('inn', formData.inn);
    if (!formData.violationDescription) newErrors.violationDescription = 'Это поле обязательно';
    if (!formData.resolutionNumber) newErrors.resolutionNumber = 'Это поле обязательно';
    if (!formData.resolutionDate) newErrors.resolutionDate = 'Это поле обязательно';
    if (!formData.receivedDetails) newErrors.receivedDetails = 'Это поле обязательно';
    if (!formData.finePhoto) newErrors.finePhoto = 'Это поле обязательно';
    else validateField('finePhoto', formData.finePhoto);
    if (!formData.agreement) newErrors.agreement = 'Необходимо согласиться';
    if (!formData.terms) newErrors.terms = 'Необходимо согласиться';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    validateField(name, type === 'checkbox' ? checked : value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, photo: file });
    validateField('photo', file);
  };

  const handleFinePhotoChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, finePhoto: file });
    validateField('finePhoto', file);
  };

  const handleUserTypeChange = (type) => {
    setFormData({
      ...formData,
      userType: type,
      step: 1,
      name: '',
      address: '',
      phone: '',
      resolutionNumber: '',
      resolutionDate: '',
      issuingAuthority: '',
      receivedDate: '',
      violationDate: '',
      violationTime: '',
      violationAddress: '',
      carModel: '',
      carPlate: '',
      detectionMethod: '',
      photo: null,
      agreement: false,
      terms: false,
      contractNumber: '',
      companyName: '',
      inn: '',
      violationDescription: '',
      receivedDetails: '',
      finePhoto: null,
    });
    setErrors({});
    setSuccess('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (finePhotoInputRef.current) finePhotoInputRef.current.value = '';
  };

  const handleNextStep = () => {
    if (validateIndividualStep(formData.step)) {
      setFormData({ ...formData, step: formData.step + 1 });
    }
  };

  const handlePreviousStep = () => {
    setFormData({ ...formData, step: formData.step - 1 });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setIsSubmitting(true);

    if (formData.userType === 'individual' && !validateIndividualStep(formData.step)) {
      setIsSubmitting(false);
      return;
    }
    if (formData.userType === 'legal' && !validateLegalForm()) {
      setIsSubmitting(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setErrors({ general: 'Необходимо войти в систему.' });
      setIsSubmitting(false);
      return;
    }

    const data = new FormData();
    for (const key in formData) {
      if (key !== 'step' && formData[key] !== null) {
        data.append(key, formData[key]);
      }
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
        setSuccess(result.message || (formData.userType === 'individual' ? 'Жалоба успешно отправлена!' : 'Форма успешно отправлена!'));
        setFormData({
          userType: formData.userType,
          step: 1,
          name: '',
          address: '',
          phone: '',
          resolutionNumber: '',
          resolutionDate: '',
          issuingAuthority: '',
          receivedDate: '',
          violationDate: '',
          violationTime: '',
          violationAddress: '',
          carModel: '',
          carPlate: '',
          detectionMethod: '',
          photo: null,
          agreement: false,
          terms: false,
          contractNumber: '',
          companyName: '',
          inn: '',
          violationDescription: '',
          receivedDetails: '',
          finePhoto: null,
        });
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (finePhotoInputRef.current) finePhotoInputRef.current.value = '';
      } else {
        setErrors({ general: result.message || 'Ошибка при отправке.' });
      }
    } catch (err) {
      setErrors({ general: 'Ошибка при отправке: ' + err.message });
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
          {/* Переключатель типа пользователя */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50">
              <motion.button
                onClick={() => handleUserTypeChange('individual')}
                className={`flex items-center px-4 py-2 rounded-lg font-semibold text-sm sm:text-base font-inter transition duration-300 cursor-pointer ${
                  formData.userType === 'individual' ? 'bg-indigo-600 text-white' : 'bg-transparent text-gray-900 hover:bg-indigo-100'
                }`}
                whileHover="hover"
                variants={buttonVariants}
                aria-label="Физическое лицо"
              >
                <FaUser className="mr-2" /> Физическое лицо
              </motion.button>
              <motion.button
                onClick={() => handleUserTypeChange('legal')}
                className={`flex items-center px-4 py-2 rounded-lg font-semibold text-sm sm:text-base font-inter transition duration-300 cursor-pointer ${
                  formData.userType === 'legal' ? 'bg-amber-400 text-gray-900' : 'bg-transparent text-gray-900 hover:bg-amber-100'
                }`}
                whileHover="hover"
                variants={buttonVariants}
                aria-label="Юридическое лицо"
              >
                <FaBuilding className="mr-2" /> Юридическое лицо
              </motion.button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {formData.userType === 'individual' && (
              <>
                <progress value={formData.step} max={7} className="w-full mb-4 h-2 rounded-lg"></progress>
                <p className="text-lg sm:text-xl text-gray-600 mb-6 text-center font-inter">Введите данные</p>

                {formData.step === 1 && (
                  <>
                    <div>
                      <label className="block text-gray-900 font-semibold mb-1 font-inter">ФИО</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-sm sm:text-base font-inter"
                        required
                        autoComplete="name"
                        placeholder="Иванов Иван Иванович"
                        aria-label="Введите ваше ФИО"
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-gray-900 font-semibold mb-1 font-inter">Адрес для корреспонденции</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-sm sm:text-base font-inter"
                        required
                        autoComplete="address"
                        placeholder="г. Москва, ул. Ленина, д. 10, кв. 5"
                        aria-label="Введите адрес для корреспонденции"
                      />
                      {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
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
                        autoComplete="tel"
                        placeholder="+79991234567"
                        aria-label="Введите ваш номер телефона"
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                  </>
                )}

                {formData.step === 2 && (
                  <>
                    <div>
                      <label className="block text-gray-900 font-semibold mb-1 font-inter">Номер постановления</label>
                      <input
                        type="text"
                        name="resolutionNumber"
                        value={formData.resolutionNumber}
                        onChange={handleInputChange}
                        className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-sm sm:text-base font-inter"
                        required
                        placeholder="Укажите номер постановления"
                        aria-label="Введите номер постановления"
                      />
                      {errors.resolutionNumber && <p className="text-red-500 text-sm mt-1">{errors.resolutionNumber}</p>}
                    </div>
                    <div>
                      <label className="block text-gray-900 font-semibold mb-1 font-inter">Дата постановления</label>
                      <input
                        type="date"
                        name="resolutionDate"
                        value={formData.resolutionDate}
                        onChange={handleInputChange}
                        className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-sm sm:text-base font-inter"
                        required
                        aria-label="Введите дату постановления"
                      />
                      {errors.resolutionDate && <p className="text-red-500 text-sm mt-1">{errors.resolutionDate}</p>}
                    </div>
                  </>
                )}

                {formData.step === 3 && (
                  <>
                    <div>
                      <label className="block text-gray-900 font-semibold mb-1 font-inter">Орган и должностное лицо</label>
                      <input
                        type="text"
                        name="issuingAuthority"
                        value={formData.issuingAuthority}
                        onChange={handleInputChange}
                        className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-sm sm:text-base font-inter"
                        required
                        placeholder="Например, ГИБДД, Иванов И.И."
                        aria-label="Укажите орган и должностное лицо"
                      />
                      {errors.issuingAuthority && <p className="text-red-500 text-sm mt-1">{errors.issuingAuthority}</p>}
                    </div>
                    <div>
                      <label className="block text-gray-900 font-semibold mb-1 font-inter">Дата получения постановления</label>
                      <input
                        type="date"
                        name="receivedDate"
                        value={formData.receivedDate}
                        onChange={handleInputChange}
                        className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-sm sm:text-base font-inter"
                        required
                        aria-label="Введите дату получения постановления"
                      />
                      {errors.receivedDate && <p className="text-red-500 text-sm mt-1">{errors.receivedDate}</p>}
                    </div>
                  </>
                )}

                {formData.step === 4 && (
                  <>
                    <div>
                      <label className="block text-gray-900 font-semibold mb-1 font-inter">Дата правонарушения</label>
                      <input
                        type="date"
                        name="violationDate"
                        value={formData.violationDate}
                        onChange={handleInputChange}
                        className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-sm sm:text-base font-inter"
                        required
                        aria-label="Введите дату правонарушения"
                      />
                      {errors.violationDate && <p className="text-red-500 text-sm mt-1">{errors.violationDate}</p>}
                    </div>
                    <div>
                      <label className="block text-gray-900 font-semibold mb-1 font-inter">Время правонарушения</label>
                      <input
                        type="time"
                        name="violationTime"
                        value={formData.violationTime}
                        onChange={handleInputChange}
                        className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-sm sm:text-base font-inter"
                        required
                        aria-label="Введите время правонарушения"
                      />
                      {errors.violationTime && <p className="text-red-500 text-sm mt-1">{errors.violationTime}</p>}
                    </div>
                    <div>
                      <label className="block text-gray-900 font-semibold mb-1 font-inter">Адрес места правонарушения</label>
                      <input
                        type="text"
                        name="violationAddress"
                        value={formData.violationAddress}
                        onChange={handleInputChange}
                        className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-sm sm:text-base font-inter"
                        required
                        placeholder="г. Москва, ул. Тверская, д. 1"
                        aria-label="Введите адрес места правонарушения"
                      />
                      {errors.violationAddress && <p className="text-red-500 text-sm mt-1">{errors.violationAddress}</p>}
                    </div>
                  </>
                )}

                {formData.step === 5 && (
                  <>
                    <div>
                      <label className="block text-gray-900 font-semibold mb-1 font-inter">Марка автомобиля</label>
                      <input
                        type="text"
                        name="carModel"
                        value={formData.carModel}
                        onChange={handleInputChange}
                        className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-sm sm:text-base font-inter"
                        required
                        placeholder="Toyota Camry"
                        aria-label="Введите марку автомобиля"
                      />
                      {errors.carModel && <p className="text-red-500 text-sm mt-1">{errors.carModel}</p>}
                    </div>
                    <div>
                      <label className="block text-gray-900 font-semibold mb-1 font-inter">Госномер</label>
                      <input
                        type="text"
                        name="carPlate"
                        value={formData.carPlate}
                        onChange={handleInputChange}
                        className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-sm sm:text-base font-inter"
                        required
                        placeholder="А123ВС77"
                        aria-label="Введите госномер"
                      />
                      {errors.carPlate && <p className="text-red-500 text-sm mt-1">{errors.carPlate}</p>}
                    </div>
                    <div>
                      <label className="block text-gray-900 font-semibold mb-1 font-inter">Способ фиксации</label>
                      <input
                        type="text"
                        name="detectionMethod"
                        value={formData.detectionMethod}
                        onChange={handleInputChange}
                        className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-sm sm:text-base font-inter"
                        required
                        placeholder="Камера, радар и т.д."
                        aria-label="Укажите способ фиксации правонарушения"
                      />
                      {errors.detectionMethod && <p className="text-red-500 text-sm mt-1">{errors.detectionMethod}</p>}
                    </div>
                  </>
                )}

                {formData.step === 6 && (
                  <div>
                    <label className="block text-gray-900 font-semibold mb-1 font-inter">Фото постановления</label>
                    <motion.label
                      className="flex items-center justify-center w-full p-2 sm:p-3 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-600 transition duration-300"
                      htmlFor="photo-upload"
                      whileHover="hover"
                      variants={buttonVariants}
                    >
                      <FaCamera className="text-indigo-600 mr-2" />
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
                        aria-label="Загрузите фото постановления (JPEG, PNG, PDF)"
                      />
                    </motion.label>
                    {errors.photo && <p className="text-red-500 text-sm mt-1">{errors.photo}</p>}
                  </div>
                )}

                {formData.step === 7 && (
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="agreement"
                        checked={formData.agreement}
                        onChange={handleInputChange}
                        className="mr-2"
                        required
                        aria-label="Согласен на обработку персональных данных"
                      />
                      <label className="text-gray-600 text-sm sm:text-base font-inter">
                        Согласен на обработку персональных данных
                      </label>
                    </div>
                    {errors.agreement && <p className="text-red-500 text-sm mt-1">{errors.agreement}</p>}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="terms"
                        checked={formData.terms}
                        onChange={handleInputChange}
                        className="mr-2"
                        required
                        aria-label="Согласен с пользовательским соглашением"
                      />
                      <label className="text-gray-600 text-sm sm:text-base font-inter">
                        Согласен с{' '}
                        <a href="/terms" className="text-indigo-600 hover:underline">пользовательским соглашением</a>
                      </label>
                    </div>
                    {errors.terms && <p className="text-red-500 text-sm mt-1">{errors.terms}</p>}
                  </div>
                )}
              </>
            )}

            {formData.userType === 'legal' && (
              <>
                <p className="text-lg sm:text-xl text-gray-600 mb-6 font-inter">
                  Форма заполняется подключёнными организациями. Если вы ещё не наш клиент – заполните{' '}
                  <a href="/feedback-form" className="text-indigo-600 hover:underline">форму обратной связи</a>.
                </p>
                <div>
                  <label className="block text-gray-900 font-semibold mb-1 font-inter">Номер договора с нами</label>
                  <input
                    type="text"
                    name="contractNumber"
                    value={formData.contractNumber}
                    onChange={handleInputChange}
                    className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-sm sm:text-base font-inter"
                    required
                    placeholder="Договор №12345"
                    aria-label="Введите номер договора"
                  />
                  {errors.contractNumber && <p className="text-red-500 text-sm mt-1">{errors.contractNumber}</p>}
                </div>
                <div>
                  <label className="block text-gray-900 font-semibold mb-1 font-inter">Наименование организации</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-sm sm:text-base font-inter"
                    required
                    placeholder="ООО Ромашка"
                    aria-label="Введите наименование организации"
                  />
                  {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
                </div>
                <div>
                  <label className="block text-gray-900 font-semibold mb-1 font-inter">ИНН</label>
                  <input
                    type="text"
                    name="inn"
                    value={formData.inn}
                    onChange={handleInputChange}
                    className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-sm sm:text-base font-inter"
                    required
                    placeholder="1234567890"
                    aria-label="Введите ИНН"
                  />
                  {errors.inn && <p className="text-red-500 text-sm mt-1">{errors.inn}</p>}
                </div>
                <div>
                  <label className="block text-gray-900 font-semibold mb-1 font-inter">Краткое описание нарушения</label>
                  <input
                    type="text"
                    name="violationDescription"
                    value={formData.violationDescription}
                    onChange={handleInputChange}
                    className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-sm sm:text-base font-inter"
                    required
                    placeholder="Превышение скорости"
                    aria-label="Введите краткое описание нарушения"
                  />
                  {errors.violationDescription && <p className="text-red-500 text-sm mt-1">{errors.violationDescription}</p>}
                </div>
                <div>
                  <label className="block text-gray-900 font-semibold mb-1 font-inter">Номер постановления</label>
                  <input
                    type="text"
                    name="resolutionNumber"
                    value={formData.resolutionNumber}
                    onChange={handleInputChange}
                    className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-sm sm:text-base font-inter"
                    required
                    placeholder="Укажите номер постановления"
                    aria-label="Введите номер постановления"
                  />
                  {errors.resolutionNumber && <p className="text-red-500 text-sm mt-1">{errors.resolutionNumber}</p>}
                </div>
                <div>
                  <label className="block text-gray-900 font-semibold mb-1 font-inter">Дата постановления</label>
                  <input
                    type="date"
                    name="resolutionDate"
                    value={formData.resolutionDate}
                    onChange={handleInputChange}
                    className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-sm sm:text-base font-inter"
                    required
                    aria-label="Введите дату постановления"
                  />
                  {errors.resolutionDate && <p className="text-red-500 text-sm mt-1">{errors.resolutionDate}</p>}
                </div>
                <div>
                  <label className="block text-gray-900 font-semibold mb-1 font-inter">Когда вы получили постановление на руки и каким способом?</label>
                  <input
                    type="text"
                    name="receivedDetails"
                    value={formData.receivedDetails}
                    onChange={handleInputChange}
                    className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-sm sm:text-base font-inter"
                    required
                    placeholder="12.05.2025, по почте"
                    aria-label="Укажите дату и способ получения постановления"
                  />
                  {errors.receivedDetails && <p className="text-red-500 text-sm mt-1">{errors.receivedDetails}</p>}
                </div>
                <div>
                  <label className="block text-gray-900 font-semibold mb-1 font-inter">Фото штрафа</label>
                  <motion.label
                    className="flex items-center justify-center w-full p-2 sm:p-3 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-600 transition duration-300"
                    htmlFor="fine-photo-upload"
                    whileHover="hover"
                    variants={buttonVariants}
                  >
                    <FaCamera className="text-indigo-600 mr-2" />
                    <span className="text-gray-600 text-sm sm:text-base font-inter">
                      {formData.finePhoto ? formData.finePhoto.name : 'Выберите файл (JPEG, PNG, PDF)'}
                    </span>
                    <input
                      id="fine-photo-upload"
                      type="file"
                      name="finePhoto"
                      onChange={handleFinePhotoChange}
                      className="hidden"
                      accept="image/jpeg,image/png,application/pdf"
                      ref={finePhotoInputRef}
                      aria-label="Загрузите фото штрафа (JPEG, PNG, PDF)"
                    />
                  </motion.label>
                  {errors.finePhoto && <p className="text-red-500 text-sm mt-1">{errors.finePhoto}</p>}
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="agreement"
                      checked={formData.agreement}
                      onChange={handleInputChange}
                      className="mr-2"
                      required
                      aria-label="Согласен на обработку персональных данных"
                    />
                    <label className="text-gray-600 text-sm sm:text-base font-inter">
                      Согласен на обработку персональных данных
                    </label>
                  </div>
                  {errors.agreement && <p className="text-red-500 text-sm mt-1">{errors.agreement}</p>}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="terms"
                      checked={formData.terms}
                      onChange={handleInputChange}
                      className="mr-2"
                      required
                      aria-label="Согласен с пользовательским соглашением"
                    />
                    <label className="text-gray-600 text-sm sm:text-base font-inter">
                      Согласен с{' '}
                      <a href="/terms" className="text-indigo-600 hover:underline">пользовательским соглашением</a>
                    </label>
                  </div>
                  {errors.terms && <p className="text-red-500 text-sm mt-1">{errors.terms}</p>}
                </div>
              </>
            )}

            {errors.general && (
              <motion.p
                className="text-red-500 text-sm sm:text-base font-inter"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {errors.general}
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

            <div className="flex space-x-4">
              {formData.userType === 'individual' && formData.step > 1 && formData.step < 7 && (
                <motion.button
                  type="button"
                  onClick={handlePreviousStep}
                  whileHover="hover"
                  variants={buttonVariants}
                  className="w-full bg-gray-300 text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition duration-300 hover:bg-gray-400 cursor-pointer"
                  aria-label="Вернуться на предыдущий шаг"
                >
                  <FaArrowLeft className="inline mr-2" />
                  Назад
                </motion.button>
              )}
              {formData.userType === 'individual' && formData.step < 7 && (
                <motion.button
                  type="button"
                  onClick={handleNextStep}
                  whileHover="hover"
                  variants={buttonVariants}
                  className="w-full bg-indigo-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition duration-300 hover:bg-indigo-700 cursor-pointer"
                  aria-label="Перейти к следующему шагу"
                >
                  Далее
                  <FaArrowRight className="inline ml-2" />
                </motion.button>
              )}
              {(formData.userType === 'legal' || (formData.userType === 'individual' && formData.step === 7)) && (
                <motion.button
                  type="submit"
                  whileHover="hover"
                  variants={buttonVariants}
                  className={`w-full bg-amber-400 text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition duration-300 ${
                    isSubmitting || (formData.userType === 'individual' && (!formData.agreement || !formData.terms)) || (formData.userType === 'legal' && (!formData.agreement || !formData.terms)) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-amber-500 cursor-pointer'
                  }`}
                  disabled={isSubmitting || (formData.userType === 'individual' && (!formData.agreement || !formData.terms)) || (formData.userType === 'legal' && (!formData.agreement || !formData.terms))}
                  aria-label="Отправить жалобу или форму"
                >
                  {isSubmitting ? 'Отправка...' : formData.userType === 'individual' ? 'Отправить жалобу' : 'Отправить форму'}
                </motion.button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default SubmitComplaint;
