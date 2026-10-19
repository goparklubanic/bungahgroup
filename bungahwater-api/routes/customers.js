const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Get the last 50 customers
router.get('/', (req, res) => {
  const sql = `
    SELECT 
      c.phone_number,
      c.name,
      c.address,
      c.given_price,
      COALESCE(od.order_qty, 0) as order_qty,
      COALESCE(od.delivery_qty, 0) as delivery_qty,
      (c.given_price * COALESCE(od.delivery_qty, 0)) as price
    FROM customers c
    LEFT JOIN (
      SELECT 
        phone_number,
        SUM(order_qty) as order_qty,
        SUM(delivery_qty) as delivery_qty
      FROM orders_deliveries
      WHERE delivery_status = 'pending'
      GROUP BY phone_number
    ) od ON c.phone_number = od.phone_number
    ORDER BY c.rowid DESC
    LIMIT 50
  `;
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Add new customer
router.post('/new', (req, res) => {
  const { phone_number, name, address, given_price } = req.body;
  const sql = `
    INSERT INTO customers (phone_number, name, address, given_price)
    VALUES (?, ?, ?, ?)
  `;
  
  db.run(sql, [phone_number, name, address, given_price || 0], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, message: 'Customer added' });
  });
});

// Update customer
router.post('/update', (req, res) => {
  const { phone_number, name, address, given_price } = req.body;
  const sql = `
    UPDATE customers 
    SET name = ?, address = ?, given_price = ?
    WHERE phone_number = ?
  `;
  
  db.run(sql, [name, address, given_price, phone_number], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, message: 'Customer updated' });
  });
});

module.exports = router;