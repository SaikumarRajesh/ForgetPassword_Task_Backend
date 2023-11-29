import mongoose from "mongoose";

const  userschema = new mongoose.Schema({

   user_Id:{
    type:String,
    required:true
   },
   Name:{
    type:String,
    required:true
   },
   email:{
    type:String,
    required:true
   },
   password:{
    type:String,
    required:true
   },
   verificationToken:{
      type:String
   },
   newpassword:{
      type:String
   },
   confirmpassword:{
      type:String
   }
}
);

const user = mongoose.model("users",userschema)

export {user} ;
