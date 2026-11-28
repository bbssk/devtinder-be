

const express = require('express');
const userRouter = express.Router()
const { userAuth } = require("../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequest")

userRouter.get("/user/requests/received", userAuth, async (req, res) => {

    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested", //which means pending
        }).populate("fromUserId", ["firstName","lastName", "photoUrl", "age", "gender"]) //get joins and only allow few fields
        // above syntax or below syntax(with spaces between fields) can be used
        //}).populate("fromUserId", "firstName  lastName")
        res.json({
            message:"data fetched sucessfully",
            data:connectionRequests
        })
    } catch (error) {
        req.status(400).send("error: " + error.message)
    }
})

module.exports = userRouter