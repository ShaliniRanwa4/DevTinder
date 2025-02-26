
// const express = require("express");
// require("dotenv").config();
// const { connectDB } = require("./config/database");
// const app = express();
// const cors =require("cors")
// const http=require("http")

// const { Error } = require("mongoose");
// const cookieParser = require("cookie-parser");
// const PORT = process.env.PORT||7777

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );


// app.use(express.json());
// app.use(cookieParser());

// const authRouter=require("./routes/auth")
// const profileRouter=require("./routes/profile")
// const requestRouter=require("./routes/request");
// const userRouter = require("./routes/user");
// const { initializeSocket } = require("./utils/socket");
// const { chatRouter } = require("./routes/chat");


// app.use((req, res, next) => {
//   console.log(`Incoming request: ${req.method} ${req.url}`);
//   next();
// });


// app.use("/",authRouter)
// app.use("/",profileRouter)
// app.use("/",requestRouter)
// app.use("/",userRouter)
// app.use("/",chatRouter)

// // console.log(process.env.MONGO_URI)


// const server=http.createServer(app)
// initializeSocket(server)

// // console.log(process.env.PORT)
// connectDB()
//   .then(() => {
//     console.log("Database connection established");
//     server.listen(PORT, () => {
//       console.log("server started");
//     });
//   })
//   .catch((err) => {
//     console.log("database connot be connect");
//   });



const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");

require("dotenv").config();

// require("./utils/cronjob");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const initializeSocket = require("./utils/socket");
const chatRouter = require("./routes/chat");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

const server = http.createServer(app);
initializeSocket(server);

connectDB()
  .then(() => {
    console.log("Database connection established...");
    server.listen(process.env.PORT, () => {
      console.log("Server is successfully listening on port 7777...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!");
  });