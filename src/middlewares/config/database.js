
const mongoose= require("mongoose");

const connectDB=async ()=>{
    await mongoose.connect("mongodb+srv://bbsskrishna_db_user:Hola%402628@cluster0.fp99sf8.mongodb.net/devTinder")
}

module.exports={connectDB}
