

// below routes are managed here
// POST  /request/send/ignored/:userId
// POST  /request/send/interested/:userId
// POST  /request/send/accepted/:userId
// POST  /request/send/rejected/:userId



const express = require('express')
const requestRouter = express.Router()
const { userAuth } = require("../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequest")


requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {

    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })
        const data = await connectionRequest.save()
        res.json({
            message: req.user.firstName + " sent connection request",
            data
        })
    } catch (error) {
        res.status(400).send("error: " + error.message)
    }

})



module.exports = requestRouter