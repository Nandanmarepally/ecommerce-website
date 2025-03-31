import db from '../config/db.js';

// Get cart items for a user
export const getCartItems = (req, res) => {
  const userId = req.user.id; // Assuming JWT middleware sets req.user
  const sql = `
    SELECT c.id, c.product_id, p.name, p.price, c.quantity, (p.price * c.quantity) AS total_price
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?`;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Add item to cart
export const addToCart = (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  // Check if product exists
  db.query('SELECT * FROM products WHERE id = ?', [productId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Product not found' });

    const product = results[0];

    // Check if item is already in cart
    db.query('SELECT * FROM cart WHERE user_id = ? AND product_id = ?', [userId, productId], (err, cartResults) => {
      if (err) return res.status(500).json({ error: err.message });

      if (cartResults.length > 0) {
        // Update existing cart item
        const newQuantity = cartResults[0].quantity + quantity;
        db.query('UPDATE cart SET quantity = ? WHERE id = ?', [newQuantity, cartResults[0].id], (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ message: 'Cart updated successfully' });
        });
      } else {
        // Insert new cart item
        db.query('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)', [userId, productId, quantity], (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.status(201).json({ message: 'Product added to cart' });
        });
      }
    });
  });
};

// Update cart item quantity
export const updateCartItem = (req, res) => {
  const userId = req.user.id;
  const { cartId, quantity } = req.body;

  if (quantity <= 0) {
    return res.status(400).json({ message: 'Quantity must be greater than zero' });
  }

  db.query('UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?', [quantity, cartId, userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Cart item not found' });
    res.json({ message: 'Cart updated successfully' });
  });
};

// Remove item from cart
export const removeFromCart = (req, res) => {
  const userId = req.user.id;
  const { cartId } = req.params;

  db.query('DELETE FROM cart WHERE id = ? AND user_id = ?', [cartId, userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Cart item not found' });
    res.json({ message: 'Cart item removed successfully' });
  });
};

// Clear cart (after placing an order)
export const clearCart = (req, res) => {
  const userId = req.user.id;

  db.query('DELETE FROM cart WHERE user_id = ?', [userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Cart cleared successfully' });
  });
};
