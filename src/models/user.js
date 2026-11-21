
const mongoose = require('mongoose')
const validator = require('validator')


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, //converts to lower case
        trim: true,
        //rejects values that are not a valid email format (runs on create, and on update when runValidators:true)
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address: " + value)
            }
        }
    },
    password: {
        type: String,
        required: true,
        //default rules of isStrongPassword: min 8 chars, with at least 1 lowercase, 1 uppercase, 1 number and 1 symbol
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Weak password: use at least 8 characters with uppercase, lowercase, a number and a symbol")
            }
        }
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        //by default validate works for create
        //while update runValidators : true should be passed
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Invalid gender")
            }
        }
    },
    photoUrl: {
        type: String
    },
    about: {
        type: String,
        default: "This is the default about"
    },
    skills:{
        type: [String],
    }
},
{
    timestamps: true
})

const User = mongoose.model("User", userSchema)

module.exports = { User }