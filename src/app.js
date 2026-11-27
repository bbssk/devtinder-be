//try reproducing :  Cannot set headers after they are sent to the client

console.log("new proj in app.js");

const express = require("express")

const app = new express()

const { connectDB } = require("./middlewares/config/database")




const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')


//middlw ware to convert data degfault it cant collect body
app.use(express.json())
//middlw ware to parse cookies
app.use(cookieParser())







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





