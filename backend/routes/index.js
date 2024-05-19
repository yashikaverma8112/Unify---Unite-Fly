const express = require("express");
const router = express.Router();

const questionRouter = require("./Question");
const answerRouter = require("./Answer");
const User = require("./User");
const authRouter = require('./Auth');
router.get("/", (req, res) => {
  res.send("This api is reserved for quora clone");
});

router.use("/questions", questionRouter);
router.use("/answers", answerRouter);
router.use("/user", User);
router.use("/auth",authRouter)

module.exports = router;
