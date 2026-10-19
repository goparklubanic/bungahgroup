const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Get all pending/on_delivery orders
router.get('/', (req, res) => {
  const sql = `
    SELECT 
      od.order_id,
      od.order_date,
      od.order_qty,
      od.delivery_date,
      od.delivery_qty,
      od.delivery_status,
      od.payment_status,
      c.name as customer_name,
      c.phone_number,
      c.address
    FROM orders_deliveries od
    JOIN customers c ON od.phone_number = c.phone_number
    WHERE od.delivery_status != 'delivered'
    ORDER BY 
      CASE od.delivery_status 
        WHEN 'on_delivery' THEN 0 
        WHEN 'pending' THEN 1 
      END,
      c.name
  `;
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Get my orders by phone number
router.post('/my-orders', (req, res) => {
  const { phone_number } = req.body;
  const sql = `
    SELECT 
      order_date,
      order_qty,
      delivery_date,
      delivery_qty,
      delivery_status
    FROM orders_deliveries
    WHERE phone_number = ?
    ORDER BY order_date DESC
    LIMIT 20
  `;
  
  db.all(sql, [phone_number], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Create new order
router.post('/new', (req, res) => {
  const { phone_number, order_date, order_qty } = req.body;
  const sql = `
    INSERT INTO orders_deliveries (phone_number, order_date, order_qty)
    VALUES (?, ?, ?)
  `;
  
  db.run(sql, [phone_number, order_date, order_qty], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, message: 'Order created' });
  });
});

// Update order delivery
router.post('/update', (req, res) => {
  const { order_id, delivery_qty, delivery_date, delivery_status } = req.body;
  
  let updates = [];
  let params = [];

  if (delivery_qty !== undefined) {
    updates.push('delivery_qty = ?');
    params.push(delivery_qty);
  }
  if (delivery_date !== undefined) {
    updates.push('delivery_date = ?');
    params.push(delivery_date);
  }
  if (delivery_status !== undefined) {
    updates.push('delivery_status = ?');
    params.push(delivery_status);
  }

  params.push(order_id);

  const sql = `UPDATE orders_deliveries SET ${updates.join(', ')} WHERE order_id = ?`;
  
  db.run(sql, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, message: 'Order updated' });
  });
});

// Update order quantity
router.post('/update-qty', (req, res) => {
  const { order_id, order_qty } = req.body;
  const sql = `UPDATE orders_deliveries SET order_qty = ? WHERE order_id = ?`;
  
  db.run(sql, [order_qty, order_id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, message: 'Order quantity updated' });
  });
});

// Update payment status
router.post('/payment', (req, res) => {
  const { order_id, payment_status } = req.body;
  const sql = `UPDATE orders_deliveries SET delivery_status='delivered', payment_status = ? WHERE order_id = ?`;
  
  db.run(sql, [payment_status, order_id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, message: 'Payment status updated' });
  });
});

// Cancel order
router.post('/cancel', (req, res) => {
  const { order_id } = req.body;
  const sql = `DELETE FROM orders_deliveries WHERE order_id = ?`;
  
  db.run(sql, [order_id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, message: 'Order cancelled' });
  });
});

module.exports = router;