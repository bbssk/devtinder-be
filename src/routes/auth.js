//  below routes are managed here
// POST  /signup
// POST  /login
// POST  /logout


const express= require('express')
const bcrypt = require('bcrypt')
const { User } = require("../models/user")
const { validateSignUpData } = require("../utils/validation")
const authRouter= express.Router()

authRouter.post("/signup", async (req, res) => {

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

authRouter.post("/login", async (req, res) => {

    try {

        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId: emailId })

        if (!user) {
            //dont say in error email id not found
            throw new Error("Invalid Credentials")
        }

        const isPassWordValid = await user.validatePassword(password)
        if (isPassWordValid) {
            //create JWT token: jwt.sign(payload, secret, options)
            //get help from schema functions as best practice
            const token = await user.getJWT()

            //add token to cookie and send back to the user
            res.cookie("token", token)
            //cookie can also be expired
            //res.cookie("token", token, { maxAge: 5000 }) //cookie expires after 5 seconds (maxAge is in milliseconds)
            res.send("Login sucess")
        } else {
            //dont say in error password is wrong
            throw new Error("Invalid Credentials")
        }

    } catch (error) {
        res.status(400).send("error: " + error.message)
    }

})


authRouter.post("/logout", async (req, res) => {

    try {
        res.cookie("token", null,{
            expires: new Date(Date.now())
        })
        res.status(200).send("logout suucess")
    } catch (error) {
        res.status(400).send("error: " + error.message)
    }

})


module.exports= authRouter