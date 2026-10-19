import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../config';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    phone_number: '',
    order_date: new Date().toISOString().split('T')[0],
    order_qty: 1,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

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

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/orders/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': 'bw2026',
        },
        body: JSON.stringify(formData),
      });
      setFormData({
        phone_number: '',
        order_date: new Date().toISOString().split('T')[0],
        order_qty: 1,
      });
      fetchOrders();
    } catch (error) {
      console.error('Error:', error);
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

  return (
    <div className="container">
      <h2>Order Management</h2>
      <button onClick={() => navigate('/bw')} className="btn btn-secondary">
        Back to Dashboard
      </button>

      <form onSubmit={handleCreateOrder} className="form-card">
        <h3>New Order</h3>
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="text"
            value={formData.phone_number}
            onChange={(e) =>
              setFormData({ ...formData, phone_number: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label>Order Date:</label>
          <input
            type="date"
            value={formData.order_date}
            onChange={(e) =>
              setFormData({ ...formData, order_date: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label>Order Qty:</label>
          <input
            type="number"
            min="1"
            value={formData.order_qty}
            onChange={(e) =>
              setFormData({ ...formData, order_qty: parseInt(e.target.value) })
            }
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Create Order
        </button>
      </form>

      <h3>Pending Orders</h3>
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
          {orders
            .filter((o) => o.delivery_status === 'pending')
            .map((order, index) => (
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
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminOrders;