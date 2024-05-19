const User = require("../models/User.model");
const mongoose = require("mongoose")
const bcryptjs = require ('bcryptjs');
const errorHandler = require('../utils/error')
const answerDB = require("../models/Answer");
const questionDB = require("../models/Question");
const test = (req, res) => {
  res.json({
    message: 'API is working!',
  });
};    

// update user

const updateUser = async (req, res, next) => {
  console.log("enter")
  const userIdFromRequest = req.user.id;
  console.log("req.user",req.user)
  if (userIdFromRequest!== req.params.id) {
    console.log(req.user.id)
    console.log(req.params.id)
    console.log("error")
    return next(errorHandler(401, 'You can update only your account!'));
  }
  console.log(1);
  try {
    console.log("try block")
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      new mongoose.Types.ObjectId(userIdFromRequest),
      {
        $set: {
          username: req.body.username
        },
      },
      { new: true }
      )
      
      const questionUpdateResult = await questionDB.findOneAndUpdate(
        { 'user.currentUser._id': userIdFromRequest },
        { $set: {user:req.body.user}  },
        { new: true }
      );
      console.log('Question Update Result:', questionUpdateResult);
    

    // Update user's username in the Answers collection
    await answerDB.updateMany(
      { 'user._id': userIdFromRequest },
      { $set: {user:req.body.user} }
)    ;

    
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};






// // delete user


// // export const deleteUser = async (req, res,next) => {
// //   if (req.user.id !== req.params.id) {
// //     return next(errorHandler(401, 'You can delete only your account!'));
// //   }
// //   try {
// //     await User.findByIdAndDelete(req.params.id);
// //     res.status(200).json('User has been deleted...');
// //   } catch (error) {
// //     next(error);
// //   }

// // }

const deleteUser = async (req,res) =>{
  const {userId} = req.params;
  try{
    await User.findByIdAndDelete(new mongoose.Types.ObjectId(userId))
    .then((doc) => {
      res.send(doc);
  
    })
    .catch((err) => {
      res.status(400).send({
        staus: false,
        message: "Bad format",
      });
    });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}
module.exports = {test,updateUser,deleteUser}