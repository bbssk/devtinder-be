

const express = require('express');
const userRouter = express.Router()
const { userAuth } = require("../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequest")

userRouter.get("/user/requests", userAuth, async (req, res) => {

    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        })
        res.json({
            message:"data fetched sucessfully",
            data:connectionRequests
        })
    } catch (error) {
        req.status(400).send("error: " + error.message)
    }
})

module.exports = userRouter