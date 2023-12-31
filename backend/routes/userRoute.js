import express from 'express';
import { getLoginStatus, getUser, loginUser, logoutUser, registerUser } from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/getUser', protect, getUser);
router.get('/login-status', getLoginStatus);

export default router;
