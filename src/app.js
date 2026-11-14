//various regexs can be added here 

console.log("new proj in app.js");

const express= require("express")

const app = new express()

//listen in port 3000
app.listen(3000,()=>
    console.log("success on port 3000"),
    console.log("http://localhost:3000/")
)

//Note: ? is in express 4 and in {} is in express 5
// app.get("/a{b}c", (req,res)=>{
//     res.send("HURRRRRAAAAYYYYYYY")
// })

//Note: + is not supported in string paths in express 5, use a regex literal instead
//abc works, abbbbbbcccc also works means min 1 b is needed between a and c
// app.get(/^\/ab+c$/, (req,res)=>{
//     res.send("HURRRRRAAAAYYYYYYY")
// })

//Note: with or without between ab and cd will work
// app.get("ab*cd", (req,res)=>{
//      res.send("HURRRRRAAAAYYYYYYY")
// })


//Note: (bc)? is not supported in express 5, use {bc} for an optional group
app.get("/a{bc}d", (req,res)=>{
     res.send("HURRRRRAAAAYYYYYYY")
})