import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../config';

function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    phone_number: '',
    name: '',
    address: '',
    given_price: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${API_URL}/bw/customers`, {
        headers: { 'x-admin-password': 'bw2026' },
      });
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isEditing ? 'update' : 'new';
      await fetch(`${API_URL}/bw/customers/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': 'bw2026',
        },
        body: JSON.stringify(formData),
      });
      setFormData({ phone_number: '', name: '', address: '', given_price: 0 });
      setIsEditing(false);
      fetchCustomers();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (customer) => {
    setFormData({
      phone_number: customer.phone_number,
      name: customer.name,
      address: customer.address,
      given_price: customer.given_price,
    });
    setIsEditing(true);
  };

  return (
    <div className="container">
      <h2>Customer Management</h2>
      <button onClick={() => navigate('/bw')} className="btn btn-secondary">
        Back to Dashboard
      </button>
      <div>{API_URL}</div>

      <form onSubmit={handleSubmit} className="form-card">
        <h3>{isEditing ? 'Edit Customer' : 'Add Customer'}</h3>
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="text"
            value={formData.phone_number}
            onChange={(e) =>
              setFormData({ ...formData, phone_number: e.target.value })
            }
            disabled={isEditing}
            required
          />
        </div>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Address:</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input
            type="number"
            value={formData.given_price}
            onChange={(e) =>
              setFormData({ ...formData, given_price: parseInt(e.target.value) })
            }
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {isEditing ? 'Update' : 'Add'}
        </button>
        {isEditing && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setIsEditing(false);
              setFormData({ phone_number: '', name: '', address: '', given_price: 0 });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <table className="data-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Address</th>
            <th>Order Qty</th>
            <th>Delivery Qty</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer, index) => (
            <tr key={customer.phone_number}>
              <td>{index + 1}</td>
              <td>{customer.name}</td>
              <td>{customer.address}</td>
              <td>{customer.order_qty}</td>
              <td>{customer.delivery_qty}</td>
              <td>{customer.price}</td>
              <td>
                <button onClick={() => handleEdit(customer)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminCustomers;