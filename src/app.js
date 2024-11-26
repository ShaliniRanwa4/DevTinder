const express=require("express")

const app= express();

app.use("/test",(req,res)=>{
    res.send("testtttttttttt")
})

// app.use("/shalu",(req,res)=>{
//     res.send("shaluuuuuuuuuu")
// })

app.use("/miss",(req,res)=>{
    res.send("misss ")
})

app.use("/",(req,res)=>{
    res.send("helllooooooooooo everyone")
})

app.listen(7777, ()=>{
    console.log("server started")
})