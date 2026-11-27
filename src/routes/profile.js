
// below routes are managed here
// GET   /profile/view
// PATCH /profile/edit
// PATCH /profile/password

const express= require('express')
const router= express.Router()



app.get("/profile", userAuth, async (req, res) => {

    try {
        const user=req.user //user is set in req from userAuth
        res.send(user)
    } catch (error) {
        res.status(400).send("error: " + error.message)
    }

})

module.exports= router