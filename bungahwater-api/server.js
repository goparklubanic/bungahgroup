const express = require('express');
const cors = require('cors');
require('dotenv').config();

const initDB = require('./db/schema');
const customerRoutes = require('./routes/customers');
const orderRoutes = require('./routes/orders');
const deliveryRoutes = require('./routes/deliveries');
const { authenticateAdmin } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initDB()
  .then(() => {
    // Public routes
    app.use('/deliveries', deliveryRoutes);
    app.use('/orders', orderRoutes);

    // Admin routes (protected)
    app.use('/bw/customers', authenticateAdmin, customerRoutes);
    app.use('/bw/orders', authenticateAdmin, orderRoutes);
    app.use('/bw/revenue', authenticateAdmin, deliveryRoutes);

    // Health check
    app.get('/health', (req, res) => {
      res.json({ status: 'ok' });
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });