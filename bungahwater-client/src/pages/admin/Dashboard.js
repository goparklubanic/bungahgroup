import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../config';

function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const navigate = useNavigate();

  useEffect(() => {
    const storedAuth = localStorage.getItem('admin_auth');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
      fetchOrders();
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'bw2026') {
      localStorage.setItem('admin_auth', 'true');
      setIsAuthenticated(true);
      fetchOrders();
    } else {
      alert('Invalid password');
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        headers: { 'x-admin-password': 'bw2026' },
      });
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleAction = async (orderId, action, data = {}) => {
    try {
      await fetch(`${API_URL}/bw/orders/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': 'bw2026',
        },
        body: JSON.stringify({ order_id: orderId, ...data }),
      });
      fetchOrders();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container">
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
      </div>
    );
  }

  const pendingOrders = orders.filter((o) => o.delivery_status === 'pending');
  const deliveryOrders = orders.filter((o) => o.delivery_status === 'on_delivery');

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      <nav className="admin-nav">
        <button onClick={() => navigate('/bw/customers')}>Customers</button>
        <button onClick={() => navigate('/bw/orders')}>Orders</button>
        <button onClick={() => navigate('/bw/revenue')}>Revenue</button>
      </nav>
      
      <div className="tabs">
        <button
          className={activeTab === 'pending' ? 'active' : ''}
          onClick={() => setActiveTab('pending')}
        >
          Orders ({pendingOrders.length})
        </button>
        <button
          className={activeTab === 'delivery' ? 'active' : ''}
          onClick={() => setActiveTab('delivery')}
        >
          On Delivery ({deliveryOrders.length})
        </button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Customer</th>
            <th>Phone</th>
            <th>Order Date</th>
            <th>Order Qty</th>
            <th>Delivery Qty</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(activeTab === 'pending' ? pendingOrders : deliveryOrders).map(
            (order, index) => (
              <tr key={order.order_id}>
                <td>{index + 1}</td>
                <td>{order.customer_name}</td>
                <td>{order.phone_number}</td>
                <td>{order.order_date}</td>
                <td>{order.order_qty}</td>
                <td>{order.delivery_qty}</td>
                <td>
                  <select
                    onChange={(e) => {
                      const action = e.target.value;
                      if (action === 'deliver') {
                        const qty = prompt('Delivery quantity:');
                        if (qty) {
                          handleAction(order.order_id, 'update', {
                            delivery_qty: parseInt(qty),
                            delivery_date: new Date().toISOString().split('T')[0],
                            delivery_status: 'on_delivery',
                          });
                        }
                      } else if (action === 'payment') {
                        handleAction(order.order_id, 'payment', {
                          payment_status: 'paid',
                        });
                      } else if (action === 'chqty') {
                        const qty = prompt('New order quantity:');
                        if (qty) {
                          handleAction(order.order_id, 'update-qty', {
                            order_qty: parseInt(qty),
                          });
                        }
                      } else if (action === 'cancel') {
                        if (window.confirm('Cancel this order?')) {
                          handleAction(order.order_id, 'cancel');
                        }
                      }
                      e.target.value = '';
                    }}
                  >
                    <option value="">Actions</option>
                    <option value="deliver">Deliver</option>
                    <option value="payment">Payment</option>
                    <option value="chqty">ChQty</option>
                    <option value="cancel">Cancel</option>
                  </select>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;