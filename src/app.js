//try reproducing :  Cannot set headers after they are sent to the client

console.log("new proj in app.js");

const express = require("express")

const app = new express()

const { connectDB } = require("./middlewares/config/database")
const { User } = require("./models/user")

const { validateSignUpData } = require("./utils/validation")
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const { userAuth } = require("./middlewares/auth")

//middlw ware to convert data degfault it cant collect body
app.use(express.json())
//middlw ware to parse cookies
app.use(cookieParser())




app.post("/signup", async (req, res) => {

    try {
        // 1. validation of req.body
        validateSignUpData(req)
        // 2. encrypt the password
        const { password } = req.body
        // check for hashing process in bcrypt how it works and password is so hard to guess
        const passwordHash = await bcrypt.hash(password, 10)
        //req.body present only if you use express.json
        const user = new User({
            ...req.body,
            password: passwordHash
        })
        const result = await user.save()
        console.log(result)
        res.status(201).send("user added successfully")
    } catch (error) {
        res.status(400).send("error: " + error.message)
    }

})

app.post("/login", async (req, res) => {

    try {

        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId: emailId })

        if (!user) {
            //dont say in error email id not found
            throw new Error("Invalid Credentials")
        }

        const isPassWordValid = await bcrypt.compare(password, user.password)
        if (isPassWordValid) {
            //create JWT token: jwt.sign(payload, secret, options)
            const token = await jwt.sign({
                _id: user._id //payload: data inside the token (readable, so no sensitive data)
            },
                "DEV@Tinder$790" //secret: used to sign the token, move to .env later
            )

            //add token to cookie and send back to the user
            res.cookie("token", token)
            res.send("Login sucess")
        } else {
            //dont say in error password is wrong
            throw new Error("Invalid Credentials")
        }

    } catch (error) {
        res.status(400).send("error: " + error.message)
    }

})


app.get("/profile", userAuth, async (req, res) => {

    try {
        const user=req.user //user is set in req from userAuth
        res.send(user)
    } catch (error) {
        res.status(400).send("error: " + error.message)
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





