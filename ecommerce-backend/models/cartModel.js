import db from '../config/db.js';

// Create Cart Table if not exists
export const createCartTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS cart (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      product_id INT NOT NULL,
      quantity INT NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (product_id) REFERENCES products(id),
      UNIQUE (user_id, product_id)
    )`;

  db.query(sql, (err) => {
    if (err) console.error('Error creating cart table:', err.message);
    else console.log('Cart table is ready');
  });
};

// Add item to cart
export const addToCart = (userId, productId, quantity, price) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO cart (user_id, product_id, quantity, price) 
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE quantity = quantity + ?`;
      
    db.query(sql, [userId, productId, quantity, price, quantity], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows > 0);
    });
  });
};

// Get cart items for user
export const getCartItems = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT c.id, c.quantity, c.price, p.name, p.image_url 
      FROM cart c 
      JOIN products p ON c.product_id = p.id 
      WHERE c.user_id = ?`;
      
    db.query(sql, [userId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Update cart item quantity
export const updateCartItem = (cartId, quantity) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE cart SET quantity = ? WHERE id = ?';
    db.query(sql, [quantity, cartId], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows > 0);
    });
  });
};

// Remove item from cart
export const removeCartItem = (cartId) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM cart WHERE id = ?';
    db.query(sql, [cartId], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows > 0);
    });
  });
};

// Clear cart after order placement
export const clearCart = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM cart WHERE user_id = ?';
    db.query(sql, [userId], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows > 0);
    });
  });
};
