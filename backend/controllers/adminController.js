import asyncHandler from 'express-async-handler'
import Admin from '../models/adminModel.js';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';
// @desc    Auth admin/set token
//route     POST /api/admin/auth
//@access   Public
const authAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (admin && (await admin.matchPassword(password))) {
    generateToken(res, admin._id, 'adminJwt');

    res.status(201).json({
      _id: admin._id,
      email: admin.email
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
  res.status(200).json({ message: 'Auth Admin' });
});

// @desc    Logout admin
//route     POST /api/admin/logout
//@access   Public
const logoutAdmin = asyncHandler(async (req, res) => {
  res.cookie('adminJwt', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  res.status(200).json({ message: 'Admin Logged Out' });
})

// @desc    User data
//route     GET /api/admin/users
//@access   Private
const getUsers = asyncHandler(async (req, res) => {
  const user = await User.find({}).select('-password');
  res.json({user});
});

// @desc    Delete user
//route     DELETE /api/admin/users/delete
//@access   Private
const deleteUser = asyncHandler(async(req,res) => {
  const userId = req.query.id;
  console.log(userId,"userId");
  if(!userId){
    res.status(400);
    throw new Error('Invalid user data');
  }

  const deletedUser =  await User.findByIdAndRemove(userId);
  if(deletedUser){
    res.status(200).json({message:'User deleted successfully'});

  }else{
    res.status(404);
    throw new Error('Invalid user data');
  }

});

// @desc    Add new user 
//route     POST /api/admin/users/add-user
//@access   Private

const addUser = asyncHandler(async(req,res)=>{
  const {name,email,password} = req.body;

  const userExists = await User.findOne({email});

  if(userExists){
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({name,email,password});
  if(user){
    res.status(201).json({
      _id:user.id,
      name:user.name,
      email:user.email
    });
  }else{
    res.status(400);
    throw new Error('Invalid userData');
  }
});

export { authAdmin, logoutAdmin,getUsers,deleteUser,addUser };