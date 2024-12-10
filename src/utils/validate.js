const validator=require("validator")
const validateSignUpData=(req)=>{

    const {firstName,lastName,emailId,password} =req.body
    if(!firstName||!lastName){ 
        throw new Error("enter personal details please")
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("enter valid email id")
    }else if(!validator.isStrongPassword(password)){
        throw new Error("enter a strong password")
    }

}

const validateEditData=(req)=>{
    
    const allowedEditField=['skills',"photoUrl","gender","age","about"]
   const isAllowedEdit= Object.keys(req.body).every((field)=> allowedEditField.includes(field))
    return isAllowedEdit;
}


const validateEditPassword=(req)=>{
    
    const allowedEditField=['password']
   const isAllowedEdit= Object.keys(req.body).every((field)=> allowedEditField.includes(field))
    return isAllowedEdit;
}


module.exports={validateSignUpData,validateEditData,validateEditPassword}