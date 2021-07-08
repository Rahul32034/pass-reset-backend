const {response}=require("express");
var express= require("express");
const {set }=require("mongoose");
var router =express.Router();

const {getuser,userlogin,createuser,forgetpassword,stringverify,passwordreset,stringexpired} =require("../controller/login");

router.get("/",async(req,res)=>{
  try{
    const loginData =await getuser();
    res.status(200).json(loginData);
  }
  catch(error){
    console.log(error);
    res.statusCode(500);
  }
});

router.post("/register", async(req,res)=>{
  try{
    const {username,email, password}=req.body;
    const response =await createuser(username,email,password);
    res.status(response.status).json(response.msg);
  }
  catch(error){
    console.log(error);
    res.statusCode(500);
  }
})

router.post("/login",async(req,res)=>{
  try{
    const {email,password}=req.body;
    const response= await userlogin(email,password);
    res.status(response.status).json(response.msg);
  }
  catch(error){
    console.log(error);
    res.statusCode(500);
  }
})
router.post("/forget", async(req,res)=>{
  try{
    const{email}=req.body;
    const response =await forgetpassword(email);
    res.status(response.status).json(response.msg);
    setTimeout (expireString,40000,email);
  }
  catch(error){
    console.log(error);
    res.statusCode(500);
  }
})

router.post("verifyString",async(req,res)=>{
  try{
    const{email,randomString}=req.body;
    const response =await stringverify(email,randomString);
    res.status(response.status).json(response.msg);
  }
  catch(error){
    console.log(error);
    res.sendStatus(500);
  }
})

router.put("/reset", async(req,res)=>{
  try{
    const{email,password}=req.body;
    const response= await passwordreset(email,password);
    res.status(response.status).json(response.msg);
  }
  catch(error){
    console.log(error);
    res.statusCode(500);
  }
})
module.exports=router;