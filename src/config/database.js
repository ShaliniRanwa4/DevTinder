require("dotenv").config();
const mongoose = require("mongoose");


const connectDB =async()=>{
    await mongoose.connect(process.env.MONGO_URI);
}
 

module.exports={connectDB}
// require("dotenv").config();
// const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     if (!process.env.MONGO_URI) {
//       throw new Error("❌ MONGO_URI is missing in environment variables");
//     }

//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     console.log("✅ MongoDB Connected Successfully");
//   } catch (error) {
//     console.error("❌ MongoDB Connection Error:", error.message);
//     process.exit(1); // Stop the server if database connection fails
//   }
// };

// module.exports = { connectDB };
