
const express = require("express");
require("dotenv").config();
const { connectDB } = require("./config/database");
const app = express();
const cors =require("cors")
const http=require("http")

const { Error } = require("mongoose");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT||7777
const allowedOrigins = [
  "http://localhost:5173", // Local frontend (for development)
  // "https://dev-tinder-web-kappa.vercel.app" // Deployed frontend (for production)
//  "https://dev-tinder-web-qzcn.vercel.app"
// "https://dev-tinder-web-34t8.vercel.app/"
// "https://dev-tinder-web-5qx5.vercel.app"
"https://dev-tinder-web-5qx5-5xyo2jj7g-shalini-ranwas-projects.vercel.app"
];


app.use(cors(
  {
  origin: allowedOrigins, 
  // origin: "*",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"] }
// {
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
//   allowedHeaders: ["Content-Type", "Authorization"],
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
// }
));
app.use(express.json());
app.use(cookieParser());

const authRouter=require("./routes/auth")
const profileRouter=require("./routes/profile")
const requestRouter=require("./routes/request");
const userRouter = require("./routes/user");
const { initializeSocket } = require("./utils/socket");
const { chatRouter } = require("./routes/chat");


app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});


app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)
app.use("/",userRouter)
app.use("/",chatRouter)

// console.log(process.env.MONGO_URI)


const server=http.createServer(app)
initializeSocket(server)

// console.log(process.env.PORT)
connectDB()
  .then(() => {
    console.log("Database connection established");
    server.listen(PORT, () => {
      console.log("server started");
    });
  })
  .catch((err) => {
    console.log("database connot be connect");
  });
