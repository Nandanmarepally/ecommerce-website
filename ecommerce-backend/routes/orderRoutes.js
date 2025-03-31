import express from 'express';
import {
  createOrder,
  getUserOrders,
  updateOrderStatus,
  deleteOrder
} from '../controllers/orderController.js';

import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, createOrder);
router.get('/', verifyToken, getUserOrders);
router.put('/:orderId', verifyToken, isAdmin, updateOrderStatus);
router.delete('/:orderId', verifyToken, isAdmin, deleteOrder);

export default router;
