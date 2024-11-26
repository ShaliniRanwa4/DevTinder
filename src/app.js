const express=require("express")

const app= express();
const { adminAuth }=require("./middlewares/auth")

app.use("/admin",adminAuth)

app.get("/user",(req,res)=>{
    res.send("userrrrrrrr")
})


app.get("/admin/addUser",(req,res)=>{
    res.send("user added successfully")
});

app.get("/admin/deleteUser",(req,res)=>{
    res.send("user deleted successfully")
})


app.listen(7777, ()=>{
    console.log("server started")
})