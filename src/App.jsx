import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { decodeJwt } from 'jose';
import Home from './pages/Home';
import SubmitComplaint from './pages/SubmitComplaint';
import About from './pages/About';
import MyComplaints from './pages/MyComplaints';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Header from './components/Header';
import Footer from './components/Footer';
import Admin from './pages/Admin';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = decodeJwt(token);
        setIsAuthenticated(true);
        setIsAdmin(decoded.role === 'admin');
      } catch (error) {
        console.error('Ошибка декодирования токена:', error);
        setIsAuthenticated(false);
        setIsAdmin(false);
        localStorage.removeItem('token'); // Удаляем недействительный токен
      }
    } else {
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  }, []); // Можно добавить [localStorage.getItem('token')] как зависимость, если нужно отслеживать изменения

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  const AdminRoute = ({ children }) => {
    return isAuthenticated && isAdmin ? children : <Navigate to="/my-complaints" replace />;
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/submit-complaint" element={<SubmitComplaint />} />
            <Route path="/about" element={<About />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/profile"
              element={<Profile />} // Убрана ProtectedRoute для теста
            />
            <Route
              path="/my-complaints"
              element={
                <ProtectedRoute>
                  <MyComplaints />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;