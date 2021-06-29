//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

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

const userSchema = {
  email: String,
  password: String,
};

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
                if(doc.password== req.body.password){
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
    let passInput = req.body.password;

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

app.listen(port, () => {
  console.log("erver is up " + port);
});
