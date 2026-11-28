

// below routes are managed here
// POST  /request/send/ignored/:userId
// POST  /request/send/interested/:userId
// POST  /request/send/accepted/:userId
// POST  /request/send/rejected/:userId



const express = require('express')
const requestRouter = express.Router()
const { userAuth } = require("../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequest")
const { User } = require("../models/user")


requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {

    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedstatus = ["ignored", "interested"]
        if (!allowedstatus.includes(status)) {
            //return is must here otherwise flow will happen
            return res.status(400).json(
                { message: "invalid status: " + status }
            )
        }

        const toUser = await User.findById(toUserId)
        if (!toUser) {
            return res.status(404).json({
                message: "user not found"
            })
        }

        //if there is existing connection request
        const existingConnectRequest = await ConnectionRequest.findOne({
            $or: [{
                fromUserId: fromUserId,
                toUserId: toUserId,
            }, {
                fromUserId: toUserId,
                toUserId: fromUserId,
            }]
        });
        if (existingConnectRequest) {
            return res.status(400).json(
                { message: "already connection request sent :" + status }
            )
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })
        const data = await connectionRequest.save()
        res.json({
            message: req.user.firstName + "is" + status + " in " + toUser.firstName,
            data
        })
    } catch (error) {
        res.status(400).send("error: " + error.message)
    }

})


requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { status, requestId } = req.data.params

        const allowedStatus = ["accepted", "rejected"]
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "Invalid Status"
            })
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        });
        if (!connectionRequest) {
            return res.status(400).json({
                message: "connection request not found"
            })
        }


        connectionRequest.status = status;
        const resp = await connectionRequest.save();
        res.json({
            message: "connection request " + status,
            data: resp
        })

        //Bhargav to Elon
        // loggedin= touserid
        //status should always be interested
        // requestid shild be valid and present in db


    } catch (error) {
        res.status(400).send("error: " + error.message)
    }


})



module.exports = requestRouter