
// below routes are managed here
// GET   /profile/view
// PATCH /profile/edit
// PATCH /profile/password

const express = require('express')
const profileRouter = express.Router()
const { userAuth } = require("../middlewares/auth")
const { validateEditProfileData } = require("../utils/validation")


profileRouter.get("/profile/view", userAuth, async (req, res) => {

    try {
        const user = req.user //user is set in req from userAuth
        res.send(user)
    } catch (error) {
        res.status(400).send("error: " + error.message)
    }

})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {

    try {
        if(!validateEditProfileData(req)){
            throw new Error("Invalid edit request")
        }
        //logged in user, set in req by userAuth
        const loggedInUser = req.user
        //copy each field sent in the body onto the user
        Object.keys(req.body).forEach((field) => (loggedInUser[field] = req.body[field]))
        //save runs the schema validations again
        await loggedInUser.save()
        //newer return loggedInUser as it as password
        res.send(loggedInUser.firstName + ", your profile was updated")
    } catch (error) {
        res.status(400).send("error: " + error.message)
    }

})

module.exports = profileRouter