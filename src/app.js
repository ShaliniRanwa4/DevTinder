const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const User = require("./models/user");
const { Error } = require("mongoose");
app.use(express.json());

app.post("/signup", async (req, res) => {
  // console.log(req.body)
  try {
    const user = new User(req.body);
    await user.save();
    res.send("user added");
  } catch (err) {
    res.status(401).send("something went wrong"+err.message);
  }
});

//get user by email id
app.get("/user",async(req,res)=>{
    const userEmail=req.body.emailId;
    try{
        const user= await User.find({emailId:userEmail});
        if(user.length==0){
            res.status(404).send("user not found")
        }else{
            res.send(user)
        }
    }
    catch(err){
            res.send("something went wrong")
    }
})

//for all users
app.get("/feed",async(req,res)=>{
    try{
        const user=await User.find({})
        res.send(user)
    }catch{
        res.send("unable to get user")
    }
})
//delete user api
app.delete("/user",async(req,res)=>{
    const userId=req.body.userId;
    try{
        const user= await User.findByIdAndDelete(userId)
        res.send("user deleted succuessfully")
    }catch(err){
       res.send("something went wrong")
    }
})

//for updating user data 
app.patch("/user",async(req,res)=>{
    const userId=req.body.userId;
    const data=req.body;
    try{
     const user= await User.findByIdAndUpdate({_id:userId},data,{runValidators:true})
     res.send("user updated successfully")
    }catch(err){
        res.send(" Update failed: "+err.message)
    }
})


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
