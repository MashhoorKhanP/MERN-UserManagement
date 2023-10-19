import express from 'express';
const router = express.Router();
import { protect } from '../middleware/authMiddleware.js';
import { addUser, authAdmin,blockUnblockUser,deleteUser,getUpdateUserProfile,getUsers,logoutAdmin, updateUserProfile } from '../controllers/adminController.js';
import { userImage } from '../config/multer.js';


router.post('/auth',authAdmin);
router.post('/logout',logoutAdmin);
router.get('/users',protect,getUsers);
router.post('/users/add-user',protect,addUser);
router.delete('/users/delete',protect,deleteUser);
router.put('/users/unblock-block',protect,blockUnblockUser);
router.route('/users/update-user').get(protect,getUpdateUserProfile).put(protect,userImage.single("file"),updateUserProfile);
export default router;
