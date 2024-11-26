const express=require("express")

const app= express();



app.get("/user",(req,res)=>{
    res.send("user get request")
})

app.use("/user",(req,res)=>{
    res.send("newwwwwww")
})

app.post("/user",(req,res)=>{
    res.send({name:"shalini ",age: 5})
})

app.delete("/user",(req,res)=>{
    res.send("delete user")
})

app.listen(7777, ()=>{
    console.log("server started")
})