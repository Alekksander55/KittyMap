import express from "express";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
} from "../controllers/userController.js";

router.post('/auth', authUser)
router.post('/register', registerUser)
router.post('/logout', logoutUser)
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile)
router.get('/all', protect, getAllUsers)


export default router;
