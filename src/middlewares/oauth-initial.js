
const adminAuth=(req,res,next)=>{
    const isAuthenticated=false;
    if(!isAuthenticated){
       res.status(401).send("UnAunthorized")
    }
    next()
}
const userAuth=(req,res,next)=>{
    const isAuthenticated=true;
    if(!isAuthenticated){
       res.status(401).send("UnAunthorized")
    }
    next()
}

module.exports= {adminAuth, userAuth}