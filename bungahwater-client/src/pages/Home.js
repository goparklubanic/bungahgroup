import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

function Home() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [deliveries, setDeliveries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedPhone = localStorage.getItem('phone_number');
    if (storedPhone) {
      setPhoneNumber(storedPhone);
      setIsLoggedIn(true);
      fetchDeliveries();
    }
  }, []);

  const fetchDeliveries = async () => {
    try {
      const response = await fetch(`${API_URL}/deliveries`);
      const data = await response.json();
      setDeliveries(data);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (phoneNumber.trim()) {
      localStorage.setItem('phone_number', phoneNumber);
      setIsLoggedIn(true);
      fetchDeliveries();
    }
  };

  const handleOrder = () => {
    window.open('https://wa.me/6285640885740', '_blank');
  };

  if (!isLoggedIn) {
    return (
      <div className="container">
        <h2>Welcome to Bungah Water</h2>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Phone Number:</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Continue
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Today's Deliveries</h2>
      <div className="actions">
        <button onClick={handleOrder} className="btn btn-whatsapp">
          Order via WhatsApp
        </button>
        <button onClick={() => navigate('/history')} className="btn btn-secondary">
          View History
        </button>
      </div>
      
      {deliveries.length === 0 ? (
        <p className="no-data">No deliveries scheduled for today</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Customer Name</th>
              <th>Address</th>
              <th>Delivery Qty</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((delivery, index) => (
              <tr key={delivery.order_id}>
                <td>{index + 1}</td>
                <td>{delivery.customer_name}</td>
                <td>{delivery.address}</td>
                <td>{delivery.delivery_qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Home;