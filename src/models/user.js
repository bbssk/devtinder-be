
const mongoose = require('mongoose')
const validator = require('validator')
const jwt=require('jsonwebtoken')
const bcrypt = require('bcrypt')


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
        unique: true,/// with this porperty it makes that field as index and index is used for optimized search query
        lowercase: true, //converts to lower case
        trim: true,
        //rejects values that are not a valid email format (runs on create, and on update when runValidators:true)
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email address: " + value)
            }
        }
    },
    password: {
        type: String,
        required: true,
        //default rules of isStrongPassword: min 8 chars, with at least 1 lowercase, 1 uppercase, 1 number and 1 symbol
        validate(value) {
            if (!validator.isStrongPassword(value)) {
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
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
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
    skills: {
        type: [String],
    }
},
    {
        timestamps: true
    })


//compound index: one index on 2 fields together, speeds up searches that use both firstName and lastName
//e.g. searching users by full name
//field order matters: it also helps searches by firstName alone, but not by lastName alone
userSchema.index({firstName:1, lastName:1})

//dont put arrow function it breaks the things as keyword inside arrow function wont work
userSchema.methods.getJWT = async function () {
    const user= this;
    const token = await jwt.sign({
        _id: user._id //payload: data inside the token (readable, so no sensitive data)
    },
        "DEV@Tinder$790", //secret: used to sign the token, move to .env later
        //{expiresIn: "1h"}
    )
    return token;
}

//compares the password typed by the user with the hashed password saved in the db
//again a normal function (not arrow) so that "this" is the user document
userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password
    //bcrypt.compare(plain password, hash) -> true or false
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash)
    return isPasswordValid
}

const User = mongoose.model("User", userSchema)

module.exports = { User }