console.log("new proj in app.js");

const express= require("express")

const app = new express()

//listen in port 3000
app.listen(3000,()=>
    console.log("success on port 3000"),
    console.log("http://localhost:3000/")
)

//request handler

// app.use("/",(req,res)=>{
//     res.send("hello from /");
// })

//if no route found with /test it will go to normal one
app.use("/test",(req,res)=>{
    res.send("hello from route test");
})

app.use((req,res)=>{
    res.send("hello from server");
    console.log("server responded")
})