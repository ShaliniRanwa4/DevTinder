const adminAuth=(req,res,next)=>{
    const token="xxx";
    const isAdminAuth= token==="xxx";
    if(!isAdminAuth){
        res.status(403).send("access denied");
    }else{
        next();
    }
}
module.exports={adminAuth}