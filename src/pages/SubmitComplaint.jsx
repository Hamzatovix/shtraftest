import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaBuilding, FaCamera, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

function SubmitComplaint() {
  const [formData, setFormData] = useState({
    userType: 'individual',
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
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const finePhotoInputRef = useRef(null);

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    const rules = {
      phone: [/^(\+7|8)\d{10}$/, 'Введите корректный номер телефона (например, +79991234567)'],
      carPlate: [/^[АВЕКМНОРСТУХ]\d{3}[АВЕКМНОРСТУХ]{2}\d{2,3}$/, 'Введите корректный госномер (например, А123ВС77)'],
      inn: [/^\d{10}$|^\d{12}$/, 'ИНН должен содержать 10 или 12 цифр'],
      photo: [v => v && v.size <= 5 * 1024 * 1024 && ['image/jpeg', 'image/png', 'application/pdf'].includes(v.type), 'Файл слишком большой или недопустимый формат (макс. 5 МБ, JPEG, PNG, PDF)'],
      finePhoto: [v => v && v.size <= 5 * 1024 * 1024 && ['image/jpeg', 'image/png', 'application/pdf'].includes(v.type), 'Файл слишком большой или недопустимый формат (макс. 5 МБ, JPEG, PNG, PDF)'],
    };
    if (rules[name]) {
      newErrors[name] = rules[name][0](value) ? '' : rules[name][1];
    } else if (['name', 'address', 'resolutionNumber', 'resolutionDate', 'issuingAuthority', 'receivedDate', 'violationDate', 'violationTime', 'violationAddress', 'carModel', 'detectionMethod', 'companyName', 'contractNumber', 'inn', 'violationDescription', 'receivedDetails'].includes(name) && !value) {
      newErrors[name] = 'Это поле обязательно';
    }
    if (['agreement', 'terms'].includes(name) && !value) newErrors[name] = 'Необходимо согласиться';
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const validateForm = () => {
    const required = {
      individual: { 1: ['name', 'address', 'phone'], 2: ['resolutionNumber', 'resolutionDate'], 3: ['issuingAuthority', 'receivedDate'], 4: ['violationDate', 'violationTime', 'violationAddress'], 5: ['carModel', 'carPlate', 'detectionMethod'], 6: ['photo'], 7: ['agreement', 'terms'] },
      legal: ['contractNumber', 'companyName', 'inn', 'violationDescription', 'resolutionNumber', 'resolutionDate', 'receivedDetails', 'finePhoto', 'agreement', 'terms'],
    };
    const newErrors = {};
    if (formData.userType === 'individual') {
      required.individual[formData.step].forEach(field => {
        if (!formData[field]) newErrors[field] = 'Это поле обязательно';
        else validateField(field, formData[field]);
      });
    } else {
      required.legal.forEach(field => {
        if (!formData[field]) newErrors[field] = 'Это поле обязательно';
        else validateField(field, formData[field]);
      });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    const newValue = type === 'checkbox' ? checked : files ? files[0] : value;
    setFormData({ ...formData, [name]: newValue });
    validateField(name, newValue);
  };

  const handleUserTypeChange = (type) => {
    setFormData({
      userType: type,
      step: 1,
      name: '', address: '', phone: '', resolutionNumber: '', resolutionDate: '', issuingAuthority: '', receivedDate: '',
      violationDate: '', violationTime: '', violationAddress: '', carModel: '', carPlate: '', detectionMethod: '', photo: null,
      agreement: false, terms: false, contractNumber: '', companyName: '', inn: '', violationDescription: '', receivedDetails: '', finePhoto: null,
    });
    setErrors({});
    setSuccess('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (finePhotoInputRef.current) finePhotoInputRef.current.value = '';
  };

  const handleNextStep = () => {
    if (validateForm()) setFormData({ ...formData, step: formData.step + 1 });
  };

  const handlePreviousStep = () => {
    if (formData.step > 1) setFormData({ ...formData, step: formData.step - 1 });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setIsSubmitting(true);
    if (!validateForm()) {
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
    Object.entries(formData).forEach(([key, value]) => value !== null && key !== 'step' && data.append(key, value));

    try {
      const response = await fetch('http://localhost:5000/api/complaints', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });
      const result = await response.json();
      if (response.ok) {
        setSuccess(formData.userType === 'individual' ? 'Жалоба успешно отправлена!' : 'Форма успешно отправлена!');
        setFormData({ ...formData, step: 1, photo: null, finePhoto: null, agreement: false, terms: false });
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

  const fadeInVariants = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
  const buttonVariants = { hover: { scale: 1.05, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' } };

  return (
    <div className="bg-gray-50 min-h-[80vh] flex items-center justify-center py-12 sm:py-16">
      <div className="max-w-2xl mx-auto p-6 sm:p-8">
        <motion.h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 text-center" variants={fadeInVariants} initial="initial" animate="animate">
          Подать жалобу
        </motion.h1>

        <motion.div className="bg-white p-6 sm:p-8 rounded-lg shadow" variants={fadeInVariants} initial="initial" animate="animate">
          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50">
              <motion.button
                onClick={() => handleUserTypeChange('individual')}
                className={`flex items-center px-4 py-2 rounded-lg font-semibold text-sm sm:text-base transition ${formData.userType === 'individual' ? 'bg-indigo-600 text-white' : 'text-gray-900 hover:bg-indigo-100'}`}
                whileHover="hover"
                variants={buttonVariants}
              >
                <FaUser className="mr-2" /> Физическое лицо
              </motion.button>
              <motion.button
                onClick={() => handleUserTypeChange('legal')}
                className={`flex items-center px-4 py-2 rounded-lg font-semibold text-sm sm:text-base transition ${formData.userType === 'legal' ? 'bg-amber-400 text-gray-900' : 'text-gray-900 hover:bg-amber-100'}`}
                whileHover="hover"
                variants={buttonVariants}
              >
                <FaBuilding className="mr-2" /> Юридическое лицо
              </motion.button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {formData.userType === 'individual' && (
              <>
                <progress value={formData.step} max={7} className="w-full mb-4 h-2 rounded-lg"></progress>
                <p className="text-lg sm:text-xl text-gray-600 mb-6 text-center">Введите данные</p>

                {formData.step === 1 && (
                  <>
                    <div>
                      <label className="block text-gray-900 font-semibold mb-1">ФИО</label>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-sm" placeholder="Иванов Иван Иванович" />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-gray-900 font-semibold mb-1">Адрес</label>
                      <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-sm" placeholder="г. Москва, ул. Ленина, д. 10, кв. 5" />
                      {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>
                    <div>
                      <label className="block text-gray-900 font-semibold mb-1">Телефон</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-sm" placeholder="+79991234567" />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                  </>
                )}

                {formData.step === 2 && (
                  <>
                    <div>
                      <label className="block text-gray-900 font-semibold mb-1">Номер постановления</label>
                      <input type="text" name="resolutionNumber" value={formData.resolutionNumber} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-sm" placeholder="Укажите номер" />
                      {errors.resolutionNumber && <p className="text-red-500 text-sm mt-1">{errors.resolutionNumber}</p>}
                    </div>
                    <div>
                      <label className="block text-gray-900 font-semibold mb-1">Дата постановления</label>
                      <input type="date" name="resolutionDate" value={formData.resolutionDate} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-sm" />
                      {errors.resolutionDate && <p className="text-red-500 text-sm mt-1">{errors.resolutionDate}</p>}
                    </div>
                  </>
                )}

                {formData.step === 3 && (
                  <>
                    <div>
                      <label className="block text-gray-900 font-semibold mb-1">Орган и должностное лицо</label>
                      <input type="text" name="issuingAuthority" value={formData.issuingAuthority} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-sm" placeholder="ГИБДД, Иванов И.И." />
                      {errors.issuingAuthority && <p className="text-red-500 text-sm mt-1">{errors.issuingAuthority}</p>}
                    </div>
                    <div>
                      <label className="block text-gray-900 font-semibold mb-1">Дата получения</label>
                      <input type="date" name="receivedDate" value={formData.receivedDate} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-sm" />
                      {errors.receivedDate && <p className="text-red-500 text-sm mt-1">{errors.receivedDate}</p>}
                    </div>
                  </>
                )}

                {formData.step === 4 && (
                  <>
                    <div>
                      <label className="block text-gray-900 font-semibold mb-1">Дата правонарушения</label>
                      <input type="date" name="violationDate" value={formData.violationDate} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-sm" />
                      {errors.violationDate && <p className="text-red-500 text-sm mt-1">{errors.violationDate}</p>}
                    </div>
                    <div>
                      <label className="block text-gray-900 font-semibold mb-1">Время правонарушения</label>
                      <input type="time" name="violationTime" value={formData.violationTime} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-sm" />
                      {errors.violationTime && <p className="text-red-500 text-sm mt-1">{errors.violationTime}</p>}
                    </div>
                    <div>
                      <label className="block text-gray-900 font-semibold mb-1">Адрес правонарушения</label>
                      <input type="text" name="violationAddress" value={formData.violationAddress} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-sm" placeholder="г. Москва, ул. Тверская, д. 1" />
                      {errors.violationAddress && <p className="text-red-500 text-sm mt-1">{errors.violationAddress}</p>}
                    </div>
                  </>
                )}

                {formData.step === 5 && (
                  <>
                    <div>
                      <label className="block text-gray-900 font-semibold mb-1">Марка автомобиля</label>
                      <input type="text" name="carModel" value={formData.carModel} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-sm" placeholder="Toyota Camry" />
                      {errors.carModel && <p className="text-red-500 text-sm mt-1">{errors.carModel}</p>}
                    </div>
                    <div>
                      <label className="block text-gray-900 font-semibold mb-1">Госномер</label>
                      <input type="text" name="carPlate" value={formData.carPlate} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-sm" placeholder="А123ВС77" />
                      {errors.carPlate && <p className="text-red-500 text-sm mt-1">{errors.carPlate}</p>}
                    </div>
                    <div>
                      <label className="block text-gray-900 font-semibold mb-1">Способ фиксации</label>
                      <input type="text" name="detectionMethod" value={formData.detectionMethod} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-sm" placeholder="Камера" />
                      {errors.detectionMethod && <p className="text-red-500 text-sm mt-1">{errors.detectionMethod}</p>}
                    </div>
                  </>
                )}

                {formData.step === 6 && (
                  <div>
                    <label className="block text-gray-900 font-semibold mb-1">Фото постановления</label>
                    <motion.label className="flex items-center justify-center w-full p-2 sm:p-3 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-600" htmlFor="photo-upload" whileHover="hover" variants={buttonVariants}>
                      <FaCamera className="text-indigo-600 mr-2" />
                      <span className="text-gray-600">{formData.photo ? formData.photo.name : 'Выберите файл'}</span>
                      <input id="photo-upload" type="file" name="photo" onChange={handleInputChange} className="hidden" accept="image/jpeg,image/png,application/pdf" ref={fileInputRef} />
                    </motion.label>
                    {errors.photo && <p className="text-red-500 text-sm mt-1">{errors.photo}</p>}
                  </div>
                )}

                {formData.step === 7 && (
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input type="checkbox" name="agreement" checked={formData.agreement} onChange={handleInputChange} className="mr-2" />
                      <label className="text-gray-600 text-sm">Согласен на обработку данных</label>
                    </div>
                    {errors.agreement && <p className="text-red-500 text-sm mt-1">{errors.agreement}</p>}
                    <div className="flex items-center">
                      <input type="checkbox" name="terms" checked={formData.terms} onChange={handleInputChange} className="mr-2" />
                      <label className="text-gray-600 text-sm">Согласен с <a href="/terms" className="text-indigo-600 hover:underline">соглашением</a></label>
                    </div>
                    {errors.terms && <p className="text-red-500 text-sm mt-1">{errors.terms}</p>}
                  </div>
                )}
              </>
            )}

            {formData.userType === 'legal' && (
              <>
                <p className="text-lg sm:text-xl text-gray-600 mb-6">Форма для организаций. Не клиент? <a href="/feedback-form" className="text-indigo-600 hover:underline">Обратная связь</a>.</p>
                <div>
                  <label className="block text-gray-900 font-semibold mb-1">Номер договора</label>
                  <input type="text" name="contractNumber" value={formData.contractNumber} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-sm" placeholder="Договор №12345" />
                  {errors.contractNumber && <p className="text-red-500 text-sm mt-1">{errors.contractNumber}</p>}
                </div>
                <div>
                  <label className="block text-gray-900 font-semibold mb-1">Название компании</label>
                  <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-sm" placeholder="ООО Ромашка" />
                  {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
                </div>
                <div>
                  <label className="block text-gray-900 font-semibold mb-1">ИНН</label>
                  <input type="text" name="inn" value={formData.inn} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-sm" placeholder="1234567890" />
                  {errors.inn && <p className="text-red-500 text-sm mt-1">{errors.inn}</p>}
                </div>
                <div>
                  <label className="block text-gray-900 font-semibold mb-1">Описание нарушения</label>
                  <input type="text" name="violationDescription" value={formData.violationDescription} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-sm" placeholder="Превышение скорости" />
                  {errors.violationDescription && <p className="text-red-500 text-sm mt-1">{errors.violationDescription}</p>}
                </div>
                <div>
                  <label className="block text-gray-900 font-semibold mb-1">Номер постановления</label>
                  <input type="text" name="resolutionNumber" value={formData.resolutionNumber} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-sm" placeholder="Укажите номер" />
                  {errors.resolutionNumber && <p className="text-red-500 text-sm mt-1">{errors.resolutionNumber}</p>}
                </div>
                <div>
                  <label className="block text-gray-900 font-semibold mb-1">Дата постановления</label>
                  <input type="date" name="resolutionDate" value={formData.resolutionDate} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-sm" />
                  {errors.resolutionDate && <p className="text-red-500 text-sm mt-1">{errors.resolutionDate}</p>}
                </div>
                <div>
                  <label className="block text-gray-900 font-semibold mb-1">Получение постановления</label>
                  <input type="text" name="receivedDetails" value={formData.receivedDetails} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-sm" placeholder="12.05.2025, по почте" />
                  {errors.receivedDetails && <p className="text-red-500 text-sm mt-1">{errors.receivedDetails}</p>}
                </div>
                <div>
                  <label className="block text-gray-900 font-semibold mb-1">Фото штрафа</label>
                  <motion.label className="flex items-center justify-center w-full p-2 sm:p-3 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-600" htmlFor="fine-photo-upload" whileHover="hover" variants={buttonVariants}>
                    <FaCamera className="text-indigo-600 mr-2" />
                    <span className="text-gray-600">{formData.finePhoto ? formData.finePhoto.name : 'Выберите файл'}</span>
                    <input id="fine-photo-upload" type="file" name="finePhoto" onChange={handleInputChange} className="hidden" accept="image/jpeg,image/png,application/pdf" ref={finePhotoInputRef} />
                  </motion.label>
                  {errors.finePhoto && <p className="text-red-500 text-sm mt-1">{errors.finePhoto}</p>}
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input type="checkbox" name="agreement" checked={formData.agreement} onChange={handleInputChange} className="mr-2" />
                    <label className="text-gray-600 text-sm">Согласен на обработку данных</label>
                  </div>
                  {errors.agreement && <p className="text-red-500 text-sm mt-1">{errors.agreement}</p>}
                  <div className="flex items-center">
                    <input type="checkbox" name="terms" checked={formData.terms} onChange={handleInputChange} className="mr-2" />
                    <label className="text-gray-600 text-sm">Согласен с <a href="/terms" className="text-indigo-600 hover:underline">соглашением</a></label>
                  </div>
                  {errors.terms && <p className="text-red-500 text-sm mt-1">{errors.terms}</p>}
                </div>
              </>
            )}

            {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}

            <div className="flex space-x-4">
              {formData.userType === 'individual' && formData.step > 1 && formData.step < 7 && (
                <motion.button type="button" onClick={handlePreviousStep} whileHover="hover" variants={buttonVariants} className="w-full bg-gray-300 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400">
                  <FaArrowLeft className="inline mr-2" /> Назад
                </motion.button>
              )}
              {formData.userType === 'individual' && formData.step < 7 && (
                <motion.button type="button" onClick={handleNextStep} whileHover="hover" variants={buttonVariants} className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700">
                  Далее <FaArrowRight className="inline ml-2" />
                </motion.button>
              )}
              {(formData.userType === 'legal' || formData.step === 7) && (
                <motion.button
                  type="submit"
                  whileHover="hover"
                  variants={buttonVariants}
                  className={`w-full bg-amber-400 text-gray-900 px-4 py-2 rounded-lg font-semibold ${isSubmitting || !formData.agreement || !formData.terms ? 'opacity-50 cursor-not-allowed' : 'hover:bg-amber-500'}`}
                  disabled={isSubmitting || !formData.agreement || !formData.terms}
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