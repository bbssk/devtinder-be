
const jwt = require('jsonwebtoken')
const { User } = require('../models/user')
const userAuth = async (req, res, next) => {
    try {
        //Read token from requested ccokies

        const { token } = req.cookies
        if (!token) {
            throw new Error("invalid token")
        }

        //validate the token
        const decodedObj = await jwt.verify(token, "DEV@Tinder$790")

        //find the user
        const { _id } = decodedObj;

        const user = await User.findById(_id)
        if (!user) {
            throw new Error("user not found")
        }
        //attach user object and send back i req for the next() function handler
        req.user=user
        next()
    } catch (error) {
        res.status(400).send("ERROR:" + error.message)
    }


}

module.exports = { userAuth }