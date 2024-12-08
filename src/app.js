const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const User = require("./models/User");
const { validateSignUpData } = require("./utils/validate");
const { Error } = require("mongoose");
const bycrpt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth}=require("./middlewares/auth")

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.get("/profile",userAuth, async (req, res) => {
  try {
    //     const cookies = req.cookies;
    //  const {token}=cookies;
    //  if(!token){
    //   throw new Error("invalid token")
    //  }
    //  const decodedData=await jwt.verify(token,"Dev@Tinder$123")
    //  const {_id}=decodedData;
    //  const user= await User.findById(_id)
    //  if(!user){
    //   throw new Error("user does not exit")
    //  }

    //   console.log(cookies);
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

app.post("/login", async (req, res) => {
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

app.post("/sendConnectionRequest",userAuth,async(req,res)=>{
  const user=req.user
  console.log("sending connection request ")
  res.send( user.firstName +"connection request sent")
})



//delete user api
// app.delete("/user",async(req,res)=>{
//     const userId=req.body.userId
//     try{
//         const user= await User.findByIdAndDelete(userId)
//         res.send("user deleted succuessfully")
//     }catch(err){
//        res.send("something went wrong")
//     }
// })


//for updating user data

connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(7777, () => {
      console.log("server started");
    });
  })
  .catch((err) => {
    console.log("database connot be connect");
  });
