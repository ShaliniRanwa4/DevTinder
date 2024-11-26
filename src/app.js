const express=require("express")

const app= express();



app.get("/user/:userId",(req,res)=>{
    console.log(req.params)
    res.send("user get request")
})




app.listen(7777, ()=>{
    console.log("server started")
})