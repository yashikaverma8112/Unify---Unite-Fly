const express = require('express');
const  verifyToken = require('../utils/verifyUser.js');
const {test,updateUser} = require('../controller/User.controller.js');
const router = express.Router();
const User = require("../models/User.model");
const Question = require("../models/Question.js");
const Answer = require("../models/Answer.js");
const mongoose = require("mongoose")
const bcryptjs = require ('bcryptjs');
const errorHandler = require('../utils/error')
// router.get('/', test);
// router.put('/update/:id',updateUser);
// router.delete('/delete/:id', verifyToken, deleteUser);
// router.delete('/delete/:id',  deleteUser);


router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const userId  = req.params.userId;
  try {
    // Assuming the request body contains the updated user profile fields
    const updatedUser = await User.findByIdAndUpdate(
      new mongoose.Types.ObjectId(id), 
       {
      $set: {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        profilePicture: req.body.profilePicture,                                                                                            
      }
    
    }, { new: true }
    
    );
    console.log('User Update Result:', updatedUser);

    const questionUpdateResult = await Question.updateMany(
      { 'user.currentUser._id': id},
      { $set: {
        'user.currentUser.username':req.body.username,
        'user.currentUser.profilePicture':req.body.profilePicture
    }  },
      { new: true }
    );
    console.log('Question Update Result:', questionUpdateResult);
  

  // Update user's username in the Answers collection
  await Answer.updateMany(
    { 'user.currentUser._id': id},
      { $set: {
        'user.currentUser.username':req.body.username,
        'user.currentUser.profilePicture':req.body.profilePicture
    }  },
      { new: true }
);
   

    res.json(updatedUser);
    const { password, ...rest } = updatedUser._doc;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/userProfile/:id',async(req,res)=>{
  const {id} = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    const userProfile = await User.findById(id);
    res.json(userProfile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
})

router.delete('/delete/:id', async (req,res) =>{
  const {id} = req.params;
  try{
    await User.findByIdAndDelete(new mongoose.Types.ObjectId(id))
    .then((doc) => {
      res.send(doc);
      console.log("deleted user")
  
    })
    .catch((err) => {
      res.status(400).send({
        staus: false,
        message: "Bad format",
      });
    });
    await Question.deleteMany({ 'user.currentUser._id': id});
    await Answer.deleteMany({ 'user.currentUser._id': id});
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
})


module.exports = router;