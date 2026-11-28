

const express = require('express');
const userRouter = express.Router()
const { userAuth } = require("../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequest")
const { User } = require("../models/user")

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

//page and limit come from the query string: /feed?page=1&limit=10 (not part of the route path)
userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        // user should not see his own card
        // user's connections
        // user already ignored people
        // already sent connection request
        // RULE: hide myself + anyone who has ANY connection request record with me
        //       (either direction, any status: interested, ignored, accepted, rejected)
        //
        // eg: users in the app = [newperson, Bhargav, Ram Charan, Prabhas]
        //
        // Step 1: newperson just joined, no requests yet
        //         feed of newperson = [Bhargav, Ram Charan, Prabhas]   (everyone except himself)
        //
        // Step 2: newperson sends "interested" to Bhargav
        //         feed of newperson = [Ram Charan, Prabhas]            (Bhargav is hidden, request already sent)
        //
        // Step 3: newperson sends "ignored" to Ram Charan
        //         feed of newperson = [Prabhas]                        (Ram Charan is hidden, already ignored)
        //
        // Step 4: Prabhas sends "interested" to newperson
        //         feed of newperson = []                               (Prabhas is hidden too, a request exists between them)
        //         Prabhas now shows in newperson's GET /user/requests/received instead
        //
        // Step 5: newperson accepts Prabhas
        //         feed of newperson = []                               (Prabhas is now a connection, still hidden)
        //         GET /user/connections of newperson = [Prabhas]
        //
        // So a person leaves the feed as soon as any request exists between the two of us

        const loggedInUser = req.user;
        delete req.query
        //query params are in req.query (req.params is only for :name parts of the path)
        const page = parseInt(req.query.page) || 1
        let limit = parseInt(req.query.limit) || 10
        limit = limit > 50 ? 50 : limit /// for db performance
        const skip = (page - 1) * limit
        // get connectionRequests sent +received
        // NOTE: this includes self user as well if atleast one request is made otherwise implement separately bro
        // populate is just used for developer comfort
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select(["fromUserId", "toUserId"]).populate("fromUserId", "firstName").populate("toUserId", "firstName")

        const hideUsersFromFeed = new Set()
        connectionRequests.forEach((row) => {
            //fromUserId/toUserId are populated (full user objects), so take ._id to get just the id
            hideUsersFromFeed.add(row.fromUserId._id.toString())
            hideUsersFromFeed.add(row.toUserId._id.toString())
        })
        console.warn(hideUsersFromFeed)

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } }, // which allows logged in user
            ]

        }).select(USER_SAFE_DATA).skip(skip).limit(limit)

        res.send(
            //connectionRequests: connectionRequests,
            //hideUsersFromFeed: hideUsersFromFeed,
            users
        )
    } catch (error) {
        res.status(400).send("error: " + error.message)
    }
})

module.exports = userRouter