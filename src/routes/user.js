

const express = require('express');
const userRouter = express.Router()
const { userAuth } = require("../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequest")

const USER_SAFE_DATA = "firstName lastName photoUrl age gender"

userRouter.get("/user/requests/received", userAuth, async (req, res) => {

    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested", //which means pending
        }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "age", "gender"]) //get joins and only allow few fields
        // above syntax or below syntax(with spaces between fields) can be used
        //}).populate("fromUserId", "firstName  lastName")
        res.json({
            message: "data fetched sucessfully",
            data: connectionRequests
        })
    } catch (error) {
        req.status(400).send("error: " + error.message)
    }
})

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", USER_SAFE_DATA)
            .populate("toUserId", USER_SAFE_DATA)
        //each request has 2 users (sender and receiver), return the one who is NOT the logged in user
        const data = connectionRequests.map((row) => {
            //ids are objects, == compares references and is always false, so use .equals() to compare the values
            if (row.fromUserId._id.equals(loggedInUser._id)) {
                return row.toUserId //i sent it, so show the receiver
            }
            return row.fromUserId //i received it, so show the sender
        })
        res.json({
            data: data
        })

    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    }
})

module.exports = userRouter