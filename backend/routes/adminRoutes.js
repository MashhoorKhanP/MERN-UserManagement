import express from 'express';
const router = express.Router();
import { protect } from '../middleware/authMiddleware.js';
import { addUser, authAdmin,deleteUser,getUsers,logoutAdmin } from '../controllers/adminController.js';


router.post('/auth',authAdmin);
router.post('/logout',logoutAdmin);
router.get('/users',protect,getUsers);
router.post('/users/add-user',protect,addUser);
router.delete('/users/delete',protect,deleteUser);
export default router;
