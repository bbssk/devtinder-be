//try reproducing :  Cannot set headers after they are sent to the client

console.log("new proj in app.js");

const express = require("express")

const app = new express()

const { connectDB } = require("./middlewares/config/database")
const { User } = require("./models/user")


app.post("/signup",async (req,res)=>{
    const userObj={
        "firstName":"Bhargav",
        "lastName":"Buddana",
        "emailId":"bbsskrishna@gmail.com",
        "password":"abcd1234"
    }
    const user= new User(userObj)
    try{
        const result= await user.save()
        console.log(result)
        res.status(201).send(result)
    }catch(error){
        res.status(400).send("error", error.message)
    }
    
})



connectDB().then(() => {
    console.log("connection established")
    //listen in port 3000
    app.listen(3000, () =>
        console.log("success on port 3000"),
        console.log("http://localhost:3000/")
    )
}).catch((err) => {
    console.error("connection failed", err.message)
})





