//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt=require("mongoose-encryption");
const md5=require("md5")

const app = express();

app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const port = 3000;
// set up schema

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});


userSchema.plugin(encrypt,{secret:process.env.SECRET ,encryptedFields:['password']});

// set up model
const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home.ejs");
});



app
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res) => {
    User.findOne(
      { email: req.body.username },
      (err, doc) => {
        if (err) {
          console.log(err);
        } else {
            if(doc){
                if(doc.password== md5(req.body.password)){
                    res.render("secrets")
                }
                else{
                    res.send("Wrond password")
                }
            }
            else{
                res.send("Username is incorrect")
            }
          
        }
      }
    );
  });

app
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post((req, res) => {
    let emailInput = req.body.username;
    let passInput = md5(req.body.password);

    const newUser = new User({
      email: emailInput,
      password: passInput,
    });

    newUser.save((err) => {
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
  });

app
  .route("/submit")
  .get((req, res) => {
    res.render("submit");
  })
  .post((req, res) => {});

app.get('/logout',(req,res)=>{
    res.redirect('/')
})

app.listen(port, () => {
  console.log("erver is up " + port);
});
