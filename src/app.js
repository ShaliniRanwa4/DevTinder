const express=require("express")

const app= express();
const { adminAuth }=require("./middlewares/auth")

app.use("/admin",adminAuth)

app.get("/user",(req,res)=>{
    try{
        throw new Error("uuuuuu")
        res.send("userrrrrrrr")
    }
    catch(err){
        res.status(501).send("something wenttttttttttttttt wrong")
    }
    
   
})


// app.get("/admin/addUser",(req,res)=>{
//     res.send("user added successfully")
// });

// app.get("/admin/deleteUser",(req,res)=>{
//     res.send("user deleted successfully")
// })

app.use("/",(err,req,res,next)=>{
    if(err){
        res.status(501).send("something went wrong")
    }
})

app.listen(7777, ()=>{
    console.log("server started")
})