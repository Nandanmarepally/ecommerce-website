import db from '../config/db.js';

// Create Products Table if not exists
export const createProductTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10,2) NOT NULL,
      stock INT NOT NULL,
      category VARCHAR(100),
      image_url VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

  db.query(sql, (err) => {
    if (err) console.error('Error creating products table:', err.message);
    else console.log('Products table is ready');
  });
};

// Create a new product
export const createProduct = (name, description, price, stock, category, image_url) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO products (name, description, price, stock, category, image_url) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [name, description, price, stock, category, image_url], (err, result) => {
      if (err) return reject(err);
      resolve(result.insertId);
    });
  });
};

// Get all products
export const getAllProducts = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM products';
    db.query(sql, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Get product by ID
export const getProductById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM products WHERE id = ?';
    db.query(sql, [id], (err, results) => {
      if (err) return reject(err);
      resolve(results.length > 0 ? results[0] : null);
    });
  });
};

// Update a product
export const updateProduct = (id, name, description, price, stock, category, image_url) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE products SET name = ?, description = ?, price = ?, stock = ?, category = ?, image_url = ? WHERE id = ?';
    db.query(sql, [name, description, price, stock, category, image_url, id], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows > 0);
    });
  });
};

// Delete a product
export const deleteProduct = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM products WHERE id = ?';
    db.query(sql, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows > 0);
    });
  });
};
