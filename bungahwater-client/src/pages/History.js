import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

function History() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const phoneNumber = localStorage.getItem('phone_number');
    if (!phoneNumber) {
      navigate('/');
      return;
    }
    fetchOrders(phoneNumber);
  }, [navigate]);

  const fetchOrders = async (phoneNumber) => {
    try {
      const response = await fetch(`${API_URL}/orders/my-orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phoneNumber }),
      });
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  return (
    <div className="container">
      <h2>My Order History</h2>
      <button onClick={() => navigate('/')} className="btn btn-secondary">
        Back to Home
      </button>
      
      {orders.length === 0 ? (
        <p className="no-data">No order history found</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Order Date</th>
              <th>Order Qty</th>
              <th>Delivery Date</th>
              <th>Delivery Qty</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index}>
                <td>{order.order_date}</td>
                <td>{order.order_qty}</td>
                <td>{order.delivery_date || '-'}</td>
                <td>{order.delivery_qty}</td>
                <td className={`status-${order.delivery_status}`}>
                  {order.delivery_status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default History;