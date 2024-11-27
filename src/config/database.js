const mongoose = require("mongoose");

const connectDB =async()=>{
    await mongoose.connect("mongodb+srv://devshalini:ATrnh5WuTTL0iry9@namastenode.s2hag.mongodb.net/devTinder");
}
 

module.exports={connectDB}