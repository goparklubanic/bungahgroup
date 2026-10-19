import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../config';

function AdminRevenue() {
  const [revenue, setRevenue] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await fetch(`${API_URL}/bw/revenue/revenue`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-password': 'bw2026',
          },
          body: JSON.stringify({ current_date: selectedDate }),
        });
        const data = await response.json();
        setRevenue(data);
      } catch (error) {
        console.error('Error fetching revenue:', error);
      }
    };

    fetchRevenue();
  }, [selectedDate]);

  const totalRevenue = revenue.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="container">
      <h2>Revenue</h2>
      <button onClick={() => navigate('/bw')} className="btn btn-secondary">
        Back to Dashboard
      </button>

      <div className="form-card">
        <div className="form-group">
          <label>Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      <div className="summary-card">
        <h3>Total Revenue: Rp {totalRevenue.toLocaleString()}</h3>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Customer Name</th>
            <th>Delivery Qty</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {revenue.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.customer_name}</td>
              <td>{item.delivery_qty}</td>
              <td>Rp {item.price.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminRevenue;