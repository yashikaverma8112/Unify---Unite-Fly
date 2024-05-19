const express = require("express");
const router = express.Router();
const mongoose = require('mongoose')
const answerDB = require("../models/Answer");

router.post("/", async (req, res) => {
  try {
    await answerDB
      .create({
        answer: req.body.answer,
        answerUrl : req.body.answerUrl,
        questionId: req.body.questionId,
        user: req.body.user,
      })
      .then(() => {
        res.status(201).send({
          status: true,
          message: "Answer added successfully",
        });
      })
      .catch((e) => {
        res.status(400).send({
          status: false,
          message: "Bad request",
        });
      });
  } catch (e) {
    res.status(500).send({
      status: false,
      message: "Error while adding answer",
    });
  }
});


router.delete("/:answerId", async (req, res) => {
  const { answerId } = req.params; // Extract the question ID from the URL

  // You can use the questionId to delete the specific question in your database
  try{
    await answerDB.findByIdAndDelete(new mongoose.Types.ObjectId(answerId))
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
});

router.put('/:id', async (req, res) => {
  try {
    const answerId = req.params.id;
    const { answer, answerUrl, user } = req.body;

    // Assuming you have a model named 'Answer'
    const updatedAnswer = await answerDB.findByIdAndUpdate(answerId, {
      answer,
      answerUrl,
      user,
    }, { new: true });

    if (!updatedAnswer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    res.json(updatedAnswer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.put("/:answerId", async (req, res) => {
  const { answerId } = req.params; // Extract the answer ID from the URL

  // You can use the answerId to update the specific answer in your database
  try {
    const updatedAnswer = await answerDB.findByIdAndUpdate(
      answerId,
      { answer: req.body.answer },
      { answerUrl: req.body.answerUrl },
      { new: true }
    );

    if (!updatedAnswer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    // Respond with the updated answer
    res.status(200).json(updatedAnswer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


let upvotes = 0;
let downvotes = 0;
let upvotedBy = new Set();
let downvotedBy = new Set();

router.post('/upvote', (req, res) => {
  const userId = req.body.userId;

  if (!userId || upvotedBy.has(userId)) {
    console.log("Invalid request or user already upvoted");
    // return res.status(400).json({ message: 'Invalid request or user already upvoted' });
    upvotes--;
  }

  upvotedBy.add(userId);
  // downvotes -= downvotedBy.delete(userId) ? 1 : 0;
  upvotes++;

  res.json({ upvotes, downvotes });
});

// router.post('/downvote/:answerId', async (req, res) => {
//   const answerId = req.params.answerId;
//   let count = 0;
//   if(count==0){
//     console.log(count)
//     try {
//       const post = await answerDB.findById(answerId);
//       if (!post) {
//         return res.status(404).json({ error: 'Post not found' });
//       }
      
//     // Increment the upvotes
//     post.downvotes += 1;
//     // Save the updated post
//     await post.save();
//     res.json({ message: 'Upvote successful',downvotes:post.downvotes });
    
//   }




router.post('/downvote', (req, res) => {
  const userId = req.body.userId;

  if (!userId || downvotedBy.has(userId)) {
    return res.status(400).json({ message: 'Invalid request or user already downvoted' });
  }

  downvotedBy.add(userId);

  if (upvotedBy.has(userId)) {
    // If the user had upvoted, decrement upvotes by 1
    upvotes--;
    upvotedBy.delete(userId);
  }

  downvotes++;

  res.json({ upvotes, downvotes });
});
  
//   catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }

//   else if(count==1){
//     try {
//       const post = await answerDB.findById(answerId);
//       if (!post) {
//         return res.status(404).json({ error: 'Post not found' });
//       }
      
//     // Increment the upvotes
//     post.downvotes -= 1;
   
//     // Save the updated post
//     await post.save();
    
//     res.json({ message: 'downvote decremented',downvotes:post.downvotes });
//   }
//   catch (error) {
//    console.error(error);
//    res.status(500).json({ error: 'Internal Server Error' });
//  }
//   }
// });

module.exports = router;
