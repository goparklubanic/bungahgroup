const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Get today's deliveries
router.get('/', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const sql = `
    SELECT 
      od.order_id,
      c.name as customer_name,
      c.address,
      od.delivery_qty
    FROM orders_deliveries od
    JOIN customers c ON od.phone_number = c.phone_number
    WHERE od.delivery_status = 'on_delivery'
      AND od.delivery_date = ?
    ORDER BY c.name
  `;
  
  db.all(sql, [today], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Get revenue for current date
router.post('/revenue', (req, res) => {
  const { current_date } = req.body;
  const sql = `
    SELECT 
      c.name as customer_name,
      od.delivery_qty,
      (c.given_price * od.delivery_qty) as price
    FROM orders_deliveries od
    JOIN customers c ON od.phone_number = c.phone_number
    WHERE od.delivery_date = ?
      AND od.delivery_status = 'delivered'
    ORDER BY c.name
  `;
  
  db.all(sql, [current_date], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

module.exports = router;