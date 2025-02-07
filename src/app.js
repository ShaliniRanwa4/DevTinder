const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const cors =require("cors")
const http=require("http")

const { Error } = require("mongoose");
const cookieParser = require("cookie-parser");

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true, }
));
app.use(express.json());
app.use(cookieParser());

const authRouter=require("./routes/auth")
const profileRouter=require("./routes/profile")
const requestRouter=require("./routes/request");
const userRouter = require("./routes/user");
const { initializeSocket } = require("./utils/socket");
const { chatRouter } = require("./routes/chat");

// app.options('/login', cors({
//   origin: 'http://localhost:5173',
//   credentials: true,
// }));


app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)
app.use("/",userRouter)
app.use("/",chatRouter)


const server=http.createServer(app)
initializeSocket(server)

connectDB()
  .then(() => {
    console.log("Database connection established");
    server.listen(7777, () => {
      console.log("server started");
    });
  })
  .catch((err) => {
    console.log("database connot be connect");
  });
