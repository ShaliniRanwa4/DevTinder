require("dotenv").config();
const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validate");
const {User} = require("../models/user");
const bycrpt = require("bcrypt");
const { now } = require("mongoose");
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
   const savedUser= await user.save();
   const token = await savedUser.getJWT();
      // console.log(token);

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
    res.json({message:"user added",data:savedUser});
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
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();
      // console.log(token);

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.json(user );
    } else {
      throw new Error("invalid credentials !! try again");
    }
  } catch (err) {
    res.status(401).send("ERROR:" + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("logout succuessfully");
});

module.exports = authRouter;
