

const validator= require('validator')
const validateSignUpData= (req)=>{
    const {firstName,lastName,emailId,password} = req.body;
    
    if(!firstName || !lastName ){
        throw new Error("name is not valid")
    }else if(firstName<4 || firstName>50){
        throw new Error("firstname should be 4-50 characters")
    }else if(!validator.isEmail(emailId)){
        throw new Error("enter valid email")
    }else if(!validator.isStrongPassword(password)){
        throw new Error("enter strong password")
    }
}


module.exports={
    validateSignUpData
}