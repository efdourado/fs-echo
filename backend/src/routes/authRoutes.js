import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';

export const createAuthRouter = (userController) => {
  const router = express.Router();

  router.post('/register', userController.registerUser.bind(userController));
  router.post('/login', userController.loginUser.bind(userController));

  router.get('/me', protect, userController.getCurrentUser.bind(userController));

  return router;
};