const express=require ("express");
const authRouter= express.Router();
const { validateSignUpData } = require("../utils/validate");
const User = require("../models/User");
const bycrpt = require("bcrypt");
// const {userAuth}=require("./middlewares/auth")

authRouter.post("/signup", async (req, res) => {
    // console.log(req.body)
    try {
      validateSignUpData(req);
      const { firstName, lastName, emailId, password } = req.body;
      const passwordHash = await bycrpt.hash(password, 10);
  
      const user = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash,
      });
      await user.save();
      res.send("user added");
    } catch (err) {
      res.status(401).send("ERROR:" + err.message);
    }
  });


  authRouter.post("/login", async (req, res) => {
    try {
      const { emailId, password } = req.body;
      const user = await User.findOne({ emailId: emailId });
      if (!user) {
        throw new Error("invalid email address");
      }
      const isPasswordValid = await user.validatePassword(password)
      if (isPasswordValid) {
        const token = await user.getJWT();
        // console.log(token);
  
        res.cookie("token", token,{expires:new Date(Date.now()+8*3600000)});
        res.send("login successfully");
      } else {
        throw new Error("invalid password !! try again");
      }
    } catch (err) {
      res.status(401).send("ERROR:" + err.message);
    }
  });
  


module.exports=authRouter;