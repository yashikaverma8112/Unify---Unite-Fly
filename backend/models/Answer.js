const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
  answer: String,
  answerUrl : String,
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "questions",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  user: Object,
});

module.exports = mongoose.model("Answers", AnswerSchema);
