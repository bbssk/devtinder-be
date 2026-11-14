console.log("new proj in app.js");

const express= require("express")

const app = new express()

//listen in port 3000
app.listen(3000,()=>
    console.log("success on port 3000"),
    console.log("http://localhost:3000/")
)

//request handler

// app.use("/test/1",(req,res)=>{
//     res.send("from route test 1");
// })

//if no route found with /test it will go to normal one
// works with starts syntax/filter with /test/*******       not /test***  but not in reverse as i ommneted above
app.use("/test",(req,res)=>{
    res.send("from route test");
})

app.use("/hello",(req,res)=>{
    res.send("from route hello");
})

// app.use("/",(req,res)=>{
//     res.send("Hi from /");
// })

// app.use((req,res)=>{
//     res.send("hello from server");
//     console.log("server responded")
// })


app.get("/user",(req,res)=>{
    res.send([
        { id: 1, firstName: "Alice", lastName: "Smith", age: 25, gender: "female" },
        { id: 2, firstName: "Bob", lastName: "Johnson", age: 29, gender: "male" },
        { id: 3, firstName: "Carol", lastName: "Williams", age: 27, gender: "female" }
    ]);
})


app.post("/user", (req,res)=>{
    res.send("done broo data saved sucessfully")
})

app.delete("/user", (req,res)=>{
    res.send("done broo data deleted sucessfully")
})