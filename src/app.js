//try reproducing :  Cannot set headers after they are sent to the client

console.log("new proj in app.js");

const express = require("express")

const app = new express()

const { connectDB } = require("./middlewares/config/database")
const { User } = require("./models/user")


//middlw ware to convert data degfault it cant collect body
app.use(express.json())




app.post("/signup",async (req,res)=>{
    
    //req.body present only if you use express.json
    const user= new User(req.body)
    try{
        const result= await user.save()
        console.log(result)
        res.status(201).send(result)
    }catch(error){
        res.status(400).send("error", error.message)
    }
    
})



//Get user by email
app.get("/user", async (req,res)=>{
    const email= req.body.emailId;
    try{
        const user= await User.find({emailId:email })
        if(user.length==0)
            res.status(404).send("not found")
        res.send(user)
    }catch(error){
        res.status(400).send("error", error.message)
    }

    
})


//Get all usrrs from feed
//http://localhost:3000/feed
app.get("/feed", async (req,res)=>{
    const email= req.body.emailId;
    try{
        const user= await User.find({})
        if(user.length==0)
            res.status(404).send("not found")
        res.send(user)
    }catch(error){
        res.status(400).send("error", error.message)
    }

    
})


//Delete user by email
app.delete("/user", async (req,res)=>{
    const id= req.body.id;
    //without this guard an empty filter could delete an unrelated document
    if(!id)
        return res.status(400).send("id is required")
    try{
        const deleted= await User.findOneAndDelete({_id:id})
        if(!deleted)
            return res.status(404).send("user not found")
        res.send(deleted)
    }catch(error){
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





