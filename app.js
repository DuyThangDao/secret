require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


const app = express();
const salt = bcrypt.genSaltSync(10);

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");
mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});



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
        bcrypt.compare(req.body.password,foundUser.password,function(err,result){
            if (result){
                res.render("secrets");
            }
        });
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
    bcrypt.hash(req.body.password,salt,function(err,hash){
        const newUser = new User({
            email : req.body.username,
            password: hash
        });
        newUser.save()
        .then(result=>{
            res.render("secrets");
        })
        .catch(err=>{
            console.log(err);
        });
    });

});


app.listen(3000,function(){
    console.log("Server started on port 3000.")
});