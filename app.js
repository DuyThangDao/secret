require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");
mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});


userSchema.plugin(encrypt,{secret : process.env.SECRET,encryptedFields:["password"]});

const User = mongoose.model("User", userSchema);

app.get("/",function(req,res){
    res.render("home");
});

app.route("/login")
.get(function(req,res){
    res.render("login");
})
.post(function(req,res){
    User.findOne({email : req.body.username}).
    then(foundUser=>{
        if (foundUser.password === req.body.password){
            res.render("secrets");
        }
    })
    .catch(err=>{
        console.log(err);
    })
});

app.route("/register")
.get(function(req,res){
    res.render("register");
})
.post(function(req,res){
    const newUser = new User({
        email : req.body.username,
        password: req.body.password
    });
    newUser.save()
    .then(result=>{
        res.render("secrets");
    })
    .catch(err=>{
        console.log(err);
    });
});


app.listen(3000,function(){
    console.log("Server started on port 3000.")
});