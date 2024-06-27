const mongoose = require('mongoose');
const Connect= async ()=>{
   try { 
    mongoose.set("strictQuery",false);
    const con= await mongoose.connect(process.env.MONGODB_URL)
    if (con){
        console.log("connected")
    }
    
   } catch (error) {
    console.log(error)
   }
    
}
module.exports=Connect;