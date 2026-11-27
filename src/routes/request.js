

// below routes are managed here
// POST  /request/send/ignored/:userId
// POST  /request/send/interested/:userId
// POST  /request/send/accepted/:userId
// POST  /request/send/rejected/:userId



const express= require('express')
const requestRouter= express.Router()
const { userAuth } = require("../middlewares/auth")


requestRouter.post("/sendConnectionrequest", userAuth, (req, res)=>{
    res.send(req.user.firstName+ " sent connection request")
})



module.exports= requestRouter