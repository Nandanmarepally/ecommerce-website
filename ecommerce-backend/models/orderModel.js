import db from '../config/db.js';

// Create Orders Table if not exists
export const createOrderTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      total_price DECIMAL(10,2) NOT NULL,
      status ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Pending',
      address TEXT NOT NULL,
      payment_method VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`;

  db.query(sql, (err) => {
    if (err) console.error('Error creating orders table:', err.message);
    else console.log('Orders table is ready');
  });
};

// Create an order
export const createOrder = (userId, totalPrice, address, paymentMethod) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO orders (user_id, total_price, address, payment_method) VALUES (?, ?, ?, ?)';
    db.query(sql, [userId, totalPrice, address, paymentMethod], (err, result) => {
      if (err) return reject(err);
      resolve(result.insertId);
    });
  });
};

// Get orders for a user
export const getUserOrders = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM orders WHERE user_id = ?';
    db.query(sql, [userId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Update order status (Admin only)
export const updateOrderStatus = (orderId, status) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE orders SET status = ? WHERE id = ?';
    db.query(sql, [status, orderId], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows > 0);
    });
  });
};

// Delete an order (Admin only)
export const deleteOrder = (orderId) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM orders WHERE id = ?';
    db.query(sql, [orderId], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows > 0);
    });
  });
};
