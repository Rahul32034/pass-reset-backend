require("dotenv").config();
const user =require("../model/login");
const bcrypt = require("bcrypt");
const nodemailer =require("nodemailer");
const saltRounds =10;

const getuser =async()=>{
    const loginUser =await user.find().exec();
    return loginUser;
}


const createuser =async(username,email,password)=>{
    const checkUser=await user.findOne({email}).exec();
    if(!checkUser){
        const hash= bcrypt.hashSync(password,saltRounds);
        const newUser=await new user({username,email,password:hash}).save();
        const data ={status:200,msg:"user registeration done",newUser};
        return data;
    }
    else
     {
        const data ={status:409, mas:"user already exist"};
        return data;
    }
}

const userlogin =async(email,password)=>{
    const checkUser =await user.findOne({email}).exec();
    if(checkUser){
        const isUserPassword = bcrypt.compareSync(password,checkUser.password);
        if(isUserPassword){
            const data ={status:200, msg:"user is authenticated"};
            return data;
        }
        else{
            const data ={status:401, msg:"incorrect password"};
            return data;
        }
        
    }
    else{
        const data={status:403,msg:"user does not exist"};
    }
}

const forgetpassword = async (email) => {   
    const checkEmail = await user.findOne({ email }).exec();
    console.log(checkEmail);
    if (checkEmail) {

        var string = Math.random().toString(36).substr(2, 10);
        const account = await nodemailer.createTestAccount();
        const mailer = nodemailer.createTransport({
            name: 'gmail.com',
            host: "smtp.gmail.com",
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
                user: process.env.sender,
                pass: process.env.password
            }
        })
        let info = await mailer.sendMail({
            from: process.env.sender,
            to: checkEmail.email, 
            subject: "password reset", 
            text: "password reset string",  
            html: `<a href="https://hopeful-einstein-5a970a.netlify.app/reset/${email}/${string}">Click on this link</a>`,
        });
        const updateString = await user.updateOne({email:checkEmail.email }, {
            randomString: string
        });
                const data = { status: 200, msg: "Check your email and reset your password", updateString };
        return data
    }
     else {
        const data = {status: 403,msg: "user does not registered"};
        return data;
    }

}

const stringverify =async(email,random)=>{
    const checkUser=await user.findOne({email:email,randomString: randomString}).exec();
    console.log(checkUser);
    if(checkUser){
        const data ={status: 200,msg :"string verified"};
        return data;
    }
    else{
        const data ={status:403, msg:"url is expired"};
        return data;
    }
}

const passwordreset =async (email,password) =>{
    const hash =bcrypt.hashSync(password, saltRounds);
    const updateString =await user.updateOne({email:email},{password : hash});
    const data ={status:200, msg: "password updated", updateString};
    return data;
}

const stringexpired =async(email)=>{
    const expire_string =await user.updateOne({email:email},{randomString :""});
    const data ={status:200,msg: "string is expired", expire_string};
}

module.exports={createuser,getuser,userlogin,forgetpassword,stringverify,passwordreset,stringexpired}