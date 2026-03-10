const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// ===== MongoDB Connection =====
mongoose.connect("mongodb+srv://rashmihalkarni:rashmi29122218@cluster0.l0hhiut.mongodb.net/?appName=Cluster0")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("MongoDB Connection Error:", err));


// ===== User Schema =====
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const User = mongoose.model("User", userSchema);


// ===== Course Registration Schema =====
const registrationSchema = new mongoose.Schema({
    studentEmail: String,
    course: String
});

const Registration = mongoose.model("Registration", registrationSchema);


// ===== Test Route =====
app.get("/test", (req, res) => {
    res.send("Server is working!");
});


// ===== Routes =====

// Login Page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "login.html"));
});

// Register Page
app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "register.html"));
});


// ===== User Registration =====
app.post("/register", async (req, res) => {

    try {

        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });

        await newUser.save();

        console.log("User registered:", req.body.email);

        res.redirect("/");

    } catch (error) {

        console.log(error);
        res.send("Error registering user");

    }

});


// ===== Login =====
app.post("/login", async (req, res) => {

    try {

        const user = await User.findOne({
            email: req.body.email,
            password: req.body.password
        });

        if (user) {

            res.sendFile(path.join(__dirname, "views", "home.html"));

        } else {

            res.send("Invalid Login Credentials");

        }

    } catch (error) {

        console.log(error);
        res.send("Login Error");

    }

});


// ===== Course Registration =====
app.post("/register-course", async (req, res) => {

    try {

        const newRegistration = new Registration({
            studentEmail: req.body.email,
            course: req.body.course
        });

        await newRegistration.save();

        res.send("Course registered successfully!");

    } catch (error) {

        console.log(error);
        res.send("Error registering course");

    }

});


// ===== Start Server =====
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});