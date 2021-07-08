const mongoose=require("mongoose");
const loginSchema =new mongoose.Schema({
    username: String,
    password: String,
    randomString: String
})
const User =mongoose.model("user",loginSchema);
module.exports=User;