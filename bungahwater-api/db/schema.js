const db = require('./connection');

const initDB = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS customers (
          phone_number TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          address TEXT NOT NULL,
          given_price INTEGER DEFAULT 0
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS orders_deliveries (
          order_id INTEGER PRIMARY KEY AUTOINCREMENT,
          phone_number TEXT NOT NULL,
          order_date TEXT NOT NULL,
          order_qty INTEGER NOT NULL,
          delivery_date TEXT DEFAULT NULL,
          delivery_qty INTEGER DEFAULT 0,
          delivery_status TEXT DEFAULT 'pending' CHECK(delivery_status IN ('pending', 'on_delivery', 'delivered')),
          payment_status TEXT DEFAULT 'unpaid' CHECK(payment_status IN ('unpaid', 'paid')),
          FOREIGN KEY (phone_number) REFERENCES customers(phone_number)
        )
      `, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Database initialized');
          resolve();
        }
      });
    });
  });
};

module.exports = initDB;