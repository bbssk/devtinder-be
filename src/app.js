console.log("new proj in app.js");

const express= require("express")

const app = new express()

//listen in port 3000
app.listen(3000,()=>
    console.log("success on port 3000"),
    console.log("http://localhost:3000/")
)

//request handler



//if no route found with /test it will go to normal one
// works with starts syntax/filter with /test/ not /test***
app.use("/test",(req,res)=>{
    res.send("from route test");
})

app.use("/hello",(req,res)=>{
    res.send("from route hello");
})

app.use("/",(req,res)=>{
    res.send("Hi from /");
})

app.use((req,res)=>{
    res.send("hello from server");
    console.log("server responded")
})