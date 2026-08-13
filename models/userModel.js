import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
   name:{
    type:String,
    required:true,
    trim:true
   },
   email:{
    type:String,
    required:true,
    unique:true
   },
   password:{
    type:String,
    required:true
   },
   phone:{
    type:String,
    required:true
   },
   address:{
   //  type:String,
    type: {}, //here we have used object because if we write multipple line or text area
              //then they have more formatting then it woun't be store in String.
    required:true
   },
   answer:{
    type:String,
    required:true
   },
   role:{
    type:Number,
    default:0
    // 0 is for false, 1 is for true
    //so here role:0 means it is normal customer while role:1 means it will be Admin
   }
},{timestamps:true});
// here timestamps will add the created time for each new user.
export default mongoose.model('users',userSchema);