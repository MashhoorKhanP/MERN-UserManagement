import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import cloudinary from 'cloudinary';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.v2.config({
  cloud_name:process.env.CLOUDINARY_NAME,
  api_key:process.env.CLOUDINARY_KEY,
  api_secret:process.env.CLOUDINARY_SECRET,
  secure:true
})

// @desc    Auth user/set token
//route     POST /api/users/auth
//@access   Public
const authUser =asyncHandler(async(req,res) => {
  const {email,password} = req.body;
  const user = await User.findOne({email});
  if(user && (await user.matchPassword(password))){
    if(user.isBlocked != true ){

      generateToken(res,user._id)
      const response = {
        _id:user._id,
        name:user.name,
        email:user.email
      };
      if(user.imageUrl){
        response.imageUrl = user.imageUrl;
      }
  
      res.status(201).json(response)
    }else{
      throw new Error('User is blocked by admin');
    }
    
  }else{
    res.status(401); 
    throw new Error('Invalid email or password')
  }
  res.status(200).json({message:'Auth User'})
});

// @desc    Register a new user
//route     POST /api/users 
//@access   Public
const registerUser =asyncHandler(async(req,res) => {
  const {name,email,password} = req.body;
  // console.log(name,email,password)
  const userExists = await User.findOne({email});
  if(userExists){
    res.status(400);
    throw new Error('User already exists')
  }
  const user = await User.create({
    name,
    email,
    password
  })
  if(user){
    generateToken(res,user._id)
    res.status(201).json({
       _id:user._id,
       name:user.name,
       email:user.email
    })
  }else{
    res.status(400);
    throw new Error('Invalid user data')
  }
  res.status(200).json({message:'Register User'})
})

// @desc    Logout user
//route     POST /api/users/logout
//@access   Public
const logoutUser =asyncHandler(async(req,res) => {
  res.cookie('jwt','',{
    httpOnly:true,
    expires: new Date(0)
  })
  res.status(200).json({message:'User Logged Out'})
}) 

// @desc    Get user profile
//route     GET /api/users/profile
//@access   Private
const getUserProfile =asyncHandler(async(req,res) => {
  const user = {
    _id:req.user._id,
    name:req.user.name,
    email:req.user.email
  };

  res.status(200).json({message:'User Profile',user})
}) 

// @desc    Update user profile
//route     PUT /api/users/profile
//@access   Private
const  updateUserProfile=asyncHandler(async(req,res) => {
  const user = await User.findById(req.user._id);
  if(user){
    if(req.file){
      const result = await cloudinary.uploader.upload(req.file.path);
      user.imageUrl = result.secure_url || null;

      const filePath = path.join('backend','public','images',req.file.filename);

      fs.unlink(filePath,(err) =>{
        if(err){
          console.error('Error deleting file (fs.unlink):'+err);
        }
      });
    }
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if(req.body.password){
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    const response = {
      _id:updatedUser._id,
      name:updatedUser.name,
      email:updatedUser.email
    };
    if(updatedUser.imageUrl){
      response.imageUrl = updatedUser.imageUrl;
    }
    res.status(200).json(response);
  }else{
    res.status(404);
    throw new Error('User not found')
  }
  res.status(200).json({message:'Update User Profile'})
}) 

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile
};