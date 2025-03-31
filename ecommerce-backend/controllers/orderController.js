import db from '../config/db.js';

// Get all orders for a user
export const getOrders = (req, res) => {
  const userId = req.user.id; // Assuming JWT middleware sets req.user
  const sql = `
    SELECT o.id, o.total_price, o.status, o.created_at,
           oi.product_id, p.name AS product_name, oi.quantity, oi.price
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = ?`;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Place an order
export const placeOrder = (req, res) => {
  const userId = req.user.id;
  const { address, paymentMethod } = req.body;

  // Check if cart is empty
  db.query('SELECT * FROM cart WHERE user_id = ?', [userId], (err, cartItems) => {
    if (err) return res.status(500).json({ error: err.message });
    if (cartItems.length === 0) return res.status(400).json({ message: 'Cart is empty' });

    // Calculate total price
    const totalPrice = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

    // Insert order into database
    const orderSql = 'INSERT INTO orders (user_id, total_price, status, address, payment_method) VALUES (?, ?, "Pending", ?, ?)';
    db.query(orderSql, [userId, totalPrice, address, paymentMethod], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      const orderId = result.insertId;

      // Insert order items
      const orderItemsSql = 'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?';
      const orderItemsValues = cartItems.map(item => [orderId, item.product_id, item.quantity, item.price]);

      db.query(orderItemsSql, [orderItemsValues], (err) => {
        if (err) return res.status(500).json({ error: err.message });

        // Clear cart after order is placed
        db.query('DELETE FROM cart WHERE user_id = ?', [userId], (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.status(201).json({ message: 'Order placed successfully', orderId });
        });
      });
    });
  });
};

// Get order details by order ID
export const getOrderById = (req, res) => {
  const { orderId } = req.params;
  const sql = `
    SELECT o.id, o.total_price, o.status, o.created_at, o.address, o.payment_method,
           oi.product_id, p.name AS product_name, oi.quantity, oi.price
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE o.id = ?`;

  db.query(sql, [orderId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Order not found' });
    res.json(results);
  });
};

// Update order status (Admin only)
export const updateOrderStatus = (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const sql = 'UPDATE orders SET status = ? WHERE id = ?';
  db.query(sql, [status, orderId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order status updated successfully' });
  });
};

// Delete an order (Admin only)
export const deleteOrder = (req, res) => {
  const { orderId } = req.params;

  db.query('DELETE FROM orders WHERE id = ?', [orderId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  });
};
