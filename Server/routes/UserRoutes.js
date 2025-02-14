import express from 'express';
import { registerUser, loginUser } from '../controllers/UserController.js';
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser); // Use loginUser here

export default router;
