const User = require("../models/User.model");
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecret = "mhassdbbvbbvbdbvdndnduhuvnd";
const signup = async(req,res) =>{
   const {username,email,password} = req.body;
   const hashedPassword = await bcryptjs.hash(req.body.password,10);
   const newUser = new User ({username,email,password: hashedPassword});
   try{
       await newUser.save();
       res.status(201).json({message:"User Added Successfully"})
    }
    catch(e){
        res.status(400).json({message:"Invalid credentials",error:e})

    }
}
const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
      const validUser = await User.findOne({ email });
      if (!validUser) {
          return res.status(400).json({ message: "User not found" });
      }

      const validPassword = await bcryptjs.compare(password, validUser.password);
      if (!validPassword) {
          return res.status(400).json({ message: "Incorrect Password" });
      }

      const token = jwt.sign({ id: validUser._id }, jwtSecret);
      const { password: hashedPassword, ...rest } = validUser._doc;
      const expiryDate = new Date(Date.now() + 3600000); // 1 hour from now
      
      res.cookie('access_token', token, { httpOnly: true, expires: expiryDate });
      
      res.status(200).json({ authToken: token, ...rest });  
      
  } 
  catch (e) {
      console.error(e);
      res.status(500).json({ message: "Server error" });
  }
};



const google = async (req,res,next) =>{
    try{
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const token = jwt.sign({ id: user._id },jwtSecret );
            const { password: hashedPassword, ...rest } = user._doc;
            const expiryDate = new Date(Date.now() + 3600000); // 1 hour
            res
              .cookie('access_token', token, {
                httpOnly: true,
                expires: expiryDate,
              })
              .status(200)
              .json(rest);
    }
    else {
        const generatedPassword =
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8);
        const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
        const newUser = new User({
          username:
            req.body.name.split(' ').join('').toLowerCase() +
            Math.random().toString(36).slice(-8),
          email: req.body.email,
          password: hashedPassword,
          profilePicture: req.body.photo,
        });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, jwtSecret);
        const { password: hashedPassword2, ...rest } = newUser._doc;
        const expiryDate = new Date(Date.now() + 3600000); // 1 hour
        res
          .cookie('access_token', token, {
            httpOnly: true,
            expires: expiryDate,
          })
          .status(200)
          .json(rest);
      }
}
    catch(error){
        next(error)
    }
}
const signOut = async (req, res, next) => {
  try {
    // res.clearCookie('access_token');
    let expires = new Date(0);
    res.cookie('access_token', '', { httpOnly: true, expires});
    // res.setHeader("Set-Cookie", "access_token=; Max-Age=0; Path=/");
    res.status(200).json({authToken:'',message: "Signout successfully."});
  }
   catch (error) {
    next(error);
  }
};

const forgotPassword = async(req,res)=>{
  const { email } = req.params;
  const { password } = req.body;


  try {
    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = await User.findOneAndUpdate({email}, {  $set: {password: hashedPassword}},  { new: true } );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}


module.exports = {signup,signin,google,signOut,forgotPassword};