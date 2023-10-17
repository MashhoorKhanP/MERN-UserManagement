import express from 'express';
const router = express.Router();
import { authAdmin,getUsers,logoutAdmin } from '../controllers/adminController.js';
import { protect } from '../middleware/adminAuthMiddleware.js';


router.post('/auth',authAdmin);
router.post('/logout',logoutAdmin);
router.get('/users',protect,getUsers)

export default router;
