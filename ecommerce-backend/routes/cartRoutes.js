import express from 'express';
import {
  addToCart,
  getCartItems,
  updateCartItem,
  removeCartItem,
  clearCart
} from '../controllers/cartController.js';

import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/add', verifyToken, addToCart);
router.get('/', verifyToken, getCartItems);
router.put('/update/:cartId', verifyToken, updateCartItem);
router.delete('/remove/:cartId', verifyToken, removeCartItem);
router.delete('/clear', verifyToken, clearCart);

export default router;
