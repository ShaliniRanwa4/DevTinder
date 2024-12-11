const express = require("express");
const { connectDB } = require("./config/database");
const app = express();


const { Error } = require("mongoose");
const cookieParser = require("cookie-parser");


app.use(express.json());
app.use(cookieParser());

const authRouter=require("./routes/auth")
const profileRouter=require("./routes/profile")
const requestRouter=require("./routes/request");
const userRouter = require("./routes/user");

app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)
app.use("/",userRouter)


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
