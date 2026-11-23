//try reproducing :  Cannot set headers after they are sent to the client

console.log("new proj in app.js");

const express = require("express")

const app = new express()

const { connectDB } = require("./middlewares/config/database")
const { User } = require("./models/user")

const { validateSignUpData } = require("./utils/validation")


//middlw ware to convert data degfault it cant collect body
app.use(express.json())




app.post("/signup", async (req, res) => {

    try {
        // 1. validation of req.body
        validateSignUpData(req)
        // 2. encrypt the password
        //req.body present only if you use express.json
        const user = new User(req.body)
        const result = await user.save()
        console.log(result)
        res.status(201).send(result)
    } catch (error) {
        res.status(400).send("error: " + error.message)
    }

})



//Get user by email
app.get("/user", async (req, res) => {
    const email = req.body.emailId;
    try {
        const user = await User.find({ emailId: email })
        if (user.length == 0)
            res.status(404).send("not found")
        res.send(user)
    } catch (error) {
        res.status(400).send("error", error.message)
    }


})


//Get all usrrs from feed
//http://localhost:3000/feed
app.get("/feed", async (req, res) => {
    const email = req.body.emailId;
    try {
        const user = await User.find({})
        if (user.length == 0)
            res.status(404).send("not found")
        res.send(user)
    } catch (error) {
        res.status(400).send("error", error.message)
    }


})


//Delete user by email
app.delete("/user", async (req, res) => {
    const id = req.body.id;
    //without this guard an empty filter could delete an unrelated document
    if (!id)
        return res.status(400).send("id is required")
    try {
        const deleted = await User.findOneAndDelete({ _id: id })
        if (!deleted)
            return res.status(404).send("user not found")
        res.send(deleted)
    } catch (error) {
        res.status(400).send("error: " + error.message)
    }
})


//Update user by id (only the fields sent in the body are changed)
// Here the id comes from the URL path (req.params), e.g. PATCH /user/<_id>
// The body then contains only the fields to change.
app.patch("/user/:id", async (req, res) => {
    // ":id" in the route path becomes req.params.id
    const id = req.params?.id;
    // everything in the body is treated as an update
    const data = req.body;

    // guard: nothing to update
    if (Object.keys(data).length == 0)
        return res.status(400).send("no fields to update")
    try {
        // whitelist: only these fields may be changed through this API
        // (firstName, lastName, emailId, password are intentionally excluded)
        const ALLOWED_UPDATES = [
            "photoUrl", "about", "gender", "age", "skills"
        ]
        // every() is true only if ALL keys sent in the body are in the whitelist
        const isUpdateAllowed = Object.keys(data).every((k) =>
            ALLOWED_UPDATES.includes(k)
        )
        if (!isUpdateAllowed) {
            return res.status(400).send("one or more fields cannot be updated")
        }
        // new:true -> return the updated document instead of the old one
        // runValidators:true -> apply schema rules (min, custom validate(), ...) on update;
        //                       by default Mongoose only runs them on create/save
        const updated = await User.findByIdAndUpdate(id, data, { new: true, runValidators: true })
        // valid id format but no such user
        if (!updated)
            return res.status(404).send("user not found")
        res.send(updated)
    } catch (error) {
        // e.g. malformed id (CastError) or a failed validation
        res.status(400).send("error: " + error.message)
    }
})

//Update user by id (only the fields sent in the body are changed)
// this is insie body
app.patch("/user", async (req, res) => {
    const { id, ...data } = req.body;


    if (!id)
        return res.status(400).send("id is required")
    if (Object.keys(data).length == 0)
        return res.status(400).send("no fields to update")
    try {
        //new:true returns the updated document, runValidators applies schema validation on update
        //runVlidators: true is for validate function which only works for post
        const ALOWED_UPDATES = [
            "photoUrl", "about", "gender", "age", "skills"
        ]
        const isUpdateAllowed = Object.keys(data).every((k) =>
            ALOWED_UPDATES.includes(k)
        )
        if (!isUpdateAllowed) {
            return res.status(400).send("few field cant be updated")
        }
        const updated = await User.findByIdAndUpdate(id, data, { new: true, runValidators: true })
        if (!updated)
            return res.status(404).send("user not found")
        res.send(updated)
    } catch (error) {
        res.status(400).send("error: " + error.message)
    }
})

// app.post("/signup",async (req,res)=>{
//     const userObj={
//         "firstName":"Bhargav",
//         "lastName":"Buddana",
//         "emailId":"bbsskrishna@gmail.com",
//         "password":"abcd1234"
//     }
//     const user= new User(userObj)
//     try{
//         const result= await user.save()
//         console.log(result)
//         res.status(201).send(result)
//     }catch(error){
//         res.status(400).send("error", error.message)
//     }

// })



connectDB().then(() => {
    console.log("connection established")
    //listen in port 3000
    app.listen(3000, () =>
        console.log("success on port 3000"),
        console.log("http://localhost:3000/")
    )
}).catch((err) => {
    console.error("connection failed", err.message)
})





