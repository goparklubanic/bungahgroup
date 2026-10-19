import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import History from './pages/History';
import AdminDashboard from './pages/admin/Dashboard';
import AdminCustomers from './pages/admin/Customers';
import AdminOrders from './pages/admin/Orders';
import AdminRevenue from './pages/admin/Revenue';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Bungah Group - Water Delivery</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<History />} />
            <Route path="/bw" element={<AdminDashboard />} />
            <Route path="/bw/customers" element={<AdminCustomers />} />
            <Route path="/bw/orders" element={<AdminOrders />} />
            <Route path="/bw/revenue" element={<AdminRevenue />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;