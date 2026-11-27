

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

const validateEditProfileData=(req)=>{
    //only these fields can be edited (email and password are not editable here)
    const allowedEditFields=["firstName","lastName","photoUrl","about","gender","age","skills"]

    //true only if every key sent in the body is in the allowed list
    const isEditAllowed = Object.keys(req.body).every((field)=>
        allowedEditFields.includes(field)
    )
    return isEditAllowed
}


module.exports={
    validateSignUpData,
    validateEditProfileData
}