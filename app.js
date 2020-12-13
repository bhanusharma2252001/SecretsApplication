require('dotenv').config()
const express=require("express");
 const bodyParser=require("body-parser")
 const ejs=require("ejs");
 const mongoose=require("mongoose");
 const encrypt=require("mongoose-encryption");
 mongoose.connect("mongodb://localhost:27017/UsersDB",{useNewUrlParser:true,useUnifiedTopology:true});
 const userSchema=new mongoose.Schema(
 {
     Username:String,
     Password:String
 })
 console.log(process.env.secret);
 
 userSchema.plugin(encrypt,{secret:process.env.secret,encryptedFields:["Password"]});
 const User=mongoose.model("User",userSchema);
 const user1=new User(
     {
         Username:"Bhavnesh Sharma",
         Password:"Password"
     }
 )
 user1.save();  
const { urlencoded } = require("body-parser");
 const app=express();
 app.use(bodyParser.urlencoded({extended:true}));
 app.use(express.static("public"));
 app.set('view engine','ejs');
 app.get("/",(req,res)=>
 {
     res.render("home");
 })
 app.get("/register",(req,res)=>
 {
     res.render("register");
 })
 app.get("/login",(req,res)=>
 {
     res.render("login");
 })
 app.post("/register",(req,res)=>
 {
     const newUser=new User(
         {
             Username:req.body.username,
             Password:req.body.password
         }
     )
     newUser.save();
     res.render("secrets");
 })
 app.post("/login",(req,res)=>
 {
     const username=req.body.username;
     const password=req.body.password
     User.findOne({Username:username},(err,result)=>
     {
         if(result)
         {
             if(password==result.Password)
             {
                 res.render("secrets")
             }
             else{
                 res.send("Wrong Password")
             }
         }
     })
 })
 app.listen(3000,()=>
 
 {
     console.log("Server started on Port 3000");
 })