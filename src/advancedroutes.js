//try reproducing :  Cannot set headers after they are sent to the client

console.log("new proj in app.js");

const express= require("express")

const app = new express()

//listen in port 3000
app.listen(3000,()=>
    console.log("success on port 3000"),
    console.log("http://localhost:3000/")
)

app.use("/user",(req,res, next)=>{
    console.log("in route1")
    next()
    return
    res.send("from route1")
    
},(req,res, next)=>{
    console.log("in route2")
    next()
    res.send("from route2")
},
(req,res, next)=>{
    console.log("in route3")
    next()
    res.send("from route3")

})

//there is one more syntax  using array

app.use("/userarray",[
    (req,res,next)=>{
        console.log("user1");
        next();
    },
    (req,res,next)=>{
        console.log("user2");
        next();
    },

],
    (req,res,next)=>{
        console.log("user3");
        next();
    },
    (req,res,next)=>{
        console.log("user4");
        res.send("user4")
    },
)