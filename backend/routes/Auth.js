const express = require("express");
const router = express.Router();
const {signup,signin, google,signOut,forgotPassword} = require('../controller/auth.controller');
router.post("/signup",signup);
router.post("/signin",signin);
router.post("/google",google);
router.post('/signout', signOut)
router.put('/forgot-password/:email',forgotPassword);
module.exports = router;
