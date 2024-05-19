const express = require("express");
const router = express.Router();
const mongoose = require('mongoose')
const questionDB = require("../models/Question");
const ObjectId = require('mongodb').ObjectId;
router.post("/", async (req, res) => {
  console.log(req.body);

  try {
    await questionDB
      .create({
        questionName: req.body.questionName,
        questionUrl: req.body.questionUrl,
        user: req.body.user,
      })
      .then(() => {
        res.status(201).send({
          status: true,
          message: "Question added successfully",
        });
      })
      .catch((err) => {
        res.status(400).send({
          staus: false,
          message: "Bad format",
        });
      });
  } catch (e) {
    res.status(500).send({
      status: false,
      message: "Error while adding question",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    await questionDB
      .aggregate([
        {
          $lookup: {
            from: "answers", //collection to join
            localField: "_id", //field from input document
            foreignField: "questionId",
            as: "allAnswers", //output array field
          },
        },
      ])
      .exec()
      .then((doc) => {
        res.status(200).send(doc);
       
      })
      .catch((error) => {
        res.status(500).send({
          status: false,
          message: "Unable to get the question details",
        });
      });
  } catch (e) {
    res.status(500).send({
      status: false,
      message: "Unexpected error",
    });
  }
});



router.put("/:questionId", async (req, res) => {
  const { questionId } = req.params; // Extract the answer ID from the URL
  let questionName= req.body.questionName;
  let questionUrl = req.body.questionUrl;
  // You can use the answerId to update the specific answer in your database
  try {
    const updatedQuestion = await questionDB.findByIdAndUpdate(
       new mongoose.Types.ObjectId(questionId),
      //  { questionName: req.body.questionName },
      //  {questionUrl:req.body.questionUrl},
      {$set:{questionName : questionName, questionUrl:questionUrl}},
       {user:req.body.user},
       { new: true },
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Respond with the updated answer
    res.status(200).json(updatedQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


router.delete("/:questionId", async (req, res) => {
  const { questionId } = req.params; // Extract the question ID from the URL

  // You can use the questionId to delete the specific question in your database
  try{
    await questionDB.findByIdAndDelete(new mongoose.Types.ObjectId(questionId))
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



router.get('/:userId',async(req,res)=>{
  try {
    // const targetId = ObjectId("target_id")
    const userId  = req.params.userId;
 
    // const questions = await questionDB.find({
    //   "user.currentUser._id": (new mongoose.Types.ObjectId(userId)),
    //   "user.currentUser": { $exists: true }
    // })
    const questions = await questionDB.find({})
    
    // console.log(userId)
    // console.log('Result:', questions)
    res.status(200).json(questions);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' });
  }
})
router.get('/search/:question',async(req,res)=>{
  try {
   
    // const { q } = req.query;
    // console.log(req.query.q);
    // if (!q) {
    //   return res.status(400).json({ error: 'Missing search query parameter' });
    // }
    // const results = await questionDB.find({ questionName: { $regex: new RegExp(q, 'i') } });

    const question = req.params.question;
    
    const questions = await questionDB.find({questionName:question});
    
    res.status(200).json(questions);


  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' });
  }
})


router.put('/:id', async (req, res) => {
  try {
    const questionId = req.params.id;
    const { questionName, questionUrl, user } = req.body;


    const updatedQuestion = await questionDB.findByIdAndUpdate(questionId, {
      questionName,
      questionUrl,
      user,
    }, { new: true });

    if (!updatedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json(updatedQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


module.exports = router;
