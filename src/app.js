//try reproducing :  Cannot set headers after they are sent to the client

console.log("new proj in app.js");

const express= require("express")

const app = new express()

//listen in port 3000
app.listen(3000,()=>
    console.log("success on port 3000"),
    console.log("http://localhost:3000/")
)


//one single funcyion can be used to handle auth
// app.use /admin calls are stoppe dhre first instead of handle multiple auth checks
app.use("/admin",(req,res,next)=>{
    const isAuthenticated=false;
    if(!isAuthenticated){
       res.status(401).send("UnAunthorized")
    }
    next()
}) 

app.get("/admin/getAllData",(req,res)=>{
    console.log("inside getalldata")
    res.send("all data sent") 
    
})

app.get("/admin/getEmployeedata",(req,res)=>{
    console.log("inside getEmployeedata")
    res.send("all Employeedata sent") 
})

