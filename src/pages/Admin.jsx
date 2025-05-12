import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetch('http://localhost:5000/api/complaints', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setComplaints(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Ошибка загрузки жалоб:', err);
        setLoading(false);
      });
  }, [navigate]);

  const handleUpdateStatus = (id, status) => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:5000/api/complaints/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    })
      .then((res) => res.json())
      .then((data) => {
        setComplaints(complaints.map((c) => (c._id === id ? { ...c, status } : c)));
      })
      .catch((err) => console.error('Ошибка обновления:', err));
  };

  if (loading) return <div className="text-center py-10">Загрузка...</div>;

  return (
    <div className="bg-gray-100 min-h-[80vh] flex items-center justify-center">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-5xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 font-manrope">Админ-панель</h1>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 border-b">Дата</th>
                <th className="p-3 border-b">Статус</th>
                <th className="p-3 border-b">Действие</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{new Date(complaint.date).toLocaleDateString()}</td>
                  <td className="p-3">{complaint.status}</td>
                  <td className="p-3">
                    <select
                      value={complaint.status}
                      onChange={(e) => handleUpdateStatus(complaint._id, e.target.value)}
                      className="p-2 border rounded"
                    >
                      <option value="В обработке">В обработке</option>
                      <option value="Одобрено">Одобрено</option>
                      <option value="Отклонено">Отклонено</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Admin;