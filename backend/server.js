const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';

// Middleware
app.use(cors());
app.use(express.json());
app.use(`/${UPLOAD_DIR}`, express.static(path.join(__dirname, UPLOAD_DIR)));

// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// User model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
});

const User = mongoose.model('User', userSchema);

// Complaint model
const complaintSchema = new mongoose.Schema({
  userType: String,
  name: String,
  inn: String,
  email: String,
  phone: String,
  description: String,
  photo: String,
  date: { type: Date, default: Date.now },
  status: { type: String, default: 'В обработке' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Complaint = mongoose.model('Complaint', complaintSchema);

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Недопустимый формат файла. Используйте JPEG, PNG или PDF.'), false);
    }
  },
});

// Token authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Токен не предоставлен' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Неверный токен' });
    req.user = user;
    next();
  });
};

// Admin authentication middleware
const authenticateAdmin = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).send('Токен не предоставлен');

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err || user.role !== 'admin') return res.status(403).send('Доступ запрещён');
    req.user = user;
    next();
  });
};

// Admin initialization (for testing, consider moving to a separate script in production)
async function initializeAdmin() {
  const adminUsername = 'admin1';
  const adminExists = await User.findOne({ username: adminUsername });
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({ username: adminUsername, password: hashedPassword, role: 'admin' });
    await admin.save();
    console.log('Админ создан:', adminUsername);
  }
}

initializeAdmin();

// Validation for registration
const registerValidation = [
  body('username').notEmpty().withMessage('Имя пользователя обязательно'),
  body('password').isLength({ min: 6 }).withMessage('Пароль должен быть не менее 6 символов'),
  body('email').isEmail().withMessage('Некорректный email'),
  body('phone').optional().isMobilePhone('ru-RU').withMessage('Некорректный номер телефона'),
];

// Registration
app.post('/api/register', registerValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Ошибка валидации', errors: errors.array() });
  }

  try {
    const { username, password, role = 'user', email = '', phone = '' } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role, email, phone });
    await user.save();
    res.status(201).json({ message: 'Пользователь зарегистрирован' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка регистрации', error: error.message });
  }
});

// Validation for login
const loginValidation = [
  body('username').notEmpty().withMessage('Имя пользователя обязательно'),
  body('password').notEmpty().withMessage('Пароль обязателен'),
];

// Login
app.post('/api/login', loginValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Ошибка валидации', errors: errors.array() });
  }

  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка входа', error: error.message });
  }
});

// Get user data
app.get('/api/user', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

// Validation for user update
const updateUserValidation = [
  body('email').optional().isEmail().withMessage('Некорректный email'),
  body('phone').optional().isMobilePhone('ru-RU').withMessage('Некорректный номер телефона'),
];

// Update user data
app.put('/api/user/update', authenticateToken, updateUserValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Ошибка валидации', errors: errors.array() });
  }

  try {
    const { email, phone } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

    user.email = email || user.email;
    user.phone = phone || user.phone;
    await user.save();

    res.status(200).json({
      message: 'Данные обновлены',
      user: { username: user.username, email: user.email, phone: user.phone },
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

// Validation for complaint submission
const complaintValidation = [
  body('userType').notEmpty().withMessage('Тип пользователя обязателен'),
  body('name').notEmpty().withMessage('Имя или наименование обязательно'),
  body('email').isEmail().withMessage('Некорректный email'),
  body('phone').isMobilePhone('ru-RU').withMessage('Некорректный номер телефона'),
  body('description').notEmpty().withMessage('Описание нарушения обязательно'),
];

// Submit complaint
app.post(
  '/api/complaints',
  authenticateToken,
  upload.single('photo'),
  complaintValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Ошибка валидации', errors: errors.array() });
    }

    try {
      const { userType, name, inn, email, phone, description } = req.body;
      const photo = req.file ? `/${UPLOAD_DIR}/${req.file.filename}` : '';
      const userId = req.user.id;

      const newComplaint = new Complaint({
        userType,
        name,
        inn,
        email,
        phone,
        description,
        photo,
        userId,
      });

      await newComplaint.save();
      res.status(201).json({ message: 'Жалоба успешно отправлена', complaint: newComplaint });
    } catch (error) {
      console.error('Ошибка при отправке жалобы:', error);
      res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
  }
);

// Get user complaints
app.get('/api/complaints', authenticateToken, async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user.id }).sort({ date: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    console.error('Ошибка при получении жалоб:', error);
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

// Admin panel
app.get('/admin', authenticateAdmin, async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ date: -1 });
    res.render('admin', { complaints });
  } catch (error) {
    console.error('Ошибка при загрузке админ-панели:', error);
    res.status(500).send('Ошибка сервера');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});