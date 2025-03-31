import db from '../config/db.js';

// Get all products
export const getProducts = (req, res) => {
  const sql = 'SELECT * FROM products';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Get a single product by ID
export const getProductById = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM products WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.json(results[0]);
  });
};

// Add a new product (Admin only)
export const addProduct = (req, res) => {
  const { name, description, price, stock } = req.body;
  if (!name || !price || !stock) {
    return res.status(400).json({ message: 'Name, price, and stock are required' });
  }

  const sql = 'INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, description, price, stock], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Product added successfully', id: result.insertId });
  });
};

// Update an existing product (Admin only)
export const updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock } = req.body;

  const sql = 'UPDATE products SET name = ?, description = ?, price = ?, stock = ? WHERE id = ?';
  db.query(sql, [name, description, price, stock, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product updated successfully' });
  });
};

// Delete a product (Admin only)
export const deleteProduct = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM products WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  });
};
