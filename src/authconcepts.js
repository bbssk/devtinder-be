//try reproducing :  Cannot set headers after they are sent to the client

console.log("new proj in app.js");

const express= require("express")

const app = new express()

const {adminAuth, userAuth}= require("./middlewares/auth")

//listen in port 3000
app.listen(3000,()=>
    console.log("success on port 3000"),
    console.log("http://localhost:3000/")
)


//one single funcyion can be used to handle auth
// app.use /admin calls are stoppe dhre first instead of handle multiple auth checks
app.use("/admin",adminAuth) 


app.get("/user/getUserData",userAuth,(req,res)=>{
    console.log("inside UserData")
    res.send("UserData sent") 
    
})

app.get("/admin/getAllData",(req,res)=>{
    console.log("inside getalldata")
    res.send("all data sent") 
    
})

app.get("/admin/getEmployeedata",(req,res)=>{
    console.log("inside getEmployeedata")
    res.send("all Employeedata sent") 
})


//error handlers
app.get("/error",(req,res)=>{
    console.log("inside error")
    throw new Error("bokka")
})


//based on nuber of parametrs these will change order matters a lot
//below 4 params are dfeined
// below func should be kept at last as error can be found after some func execution
app.use("/",(error, req,res,next)=>{
    if(error){
        res.status(500).send("something went wrong")
    }
})

