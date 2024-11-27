const express=require("express")
const {connectDB}=require("./config/database")
const app= express();
const User= require("./models/user");
app.use(express.json())

app.post("/signup", async(req,res)=>{

    // console.log(req.body)

   
try{
    const user=new User(req.body)
    await user.save()
    res.send("user added")
}catch(err){
    res.status(401).send("something went wrong")

}
   
})


connectDB().then(()=>{
    console.log("Database connection established")
    app.listen(7777, ()=>{
        console.log("server started")
    })
}).catch((err)=>{
    console.log("database connot be connect")
});


    
   
