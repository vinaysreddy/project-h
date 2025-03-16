import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";
import session from "express-session";

dotenv.config();

const app = express();
const port = 3000;

const saltRounds = 10;

// Configure session
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(passport.initialize());
app.use(passport.session());

// Database connection
const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT || 5432,
});
db.connect();

// Display login page
app.get("/login", (req, res) => {
    res.render("login.ejs");
});

// Display register page
app.get("/register", (req, res) => {
    res.render("register.ejs");
});

// Display home dashboard page
app.get("/dashboard", (req, res) => {
    console.log("req.isAuthenticated() ==== ", req.isAuthenticated())
    if (req.isAuthenticated()) {
        res.render("dashboard.ejs");
    } else {
        res.redirect("/login");
    }
});

// Default route
app.get("/", (req, res) => {
    res.render("dashboard.ejs");
});

// Register user
app.post("/register", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password_hash;

    console.log("password ====  ", password);
    console.log("eamil ====  ", email);

    try {
        const checkResult = await db.query("SELECT * FROM customer WHERE email = $1", [
            email,
        ]);

        if (checkResult.rows.length > 0) {
            // If user exists, redirect to login
            res.redirect("/login");
        } else {
            bcrypt.hash(password, saltRounds, async (err, hash) => {
                if (err) {
                    console.error("Error hashing password:", err);
                } else {
                    const first_name = req.body.first_name;
                    const last_name = req.body.last_name;
                    const dob = req.body.dob;
                    const gender = req.body.gender;

                    // Log all values
                    console.log('First Name:', first_name);
                    console.log('Last Name:', last_name);
                    console.log('Date of Birth:', dob);
                    console.log('Gender:', gender);


                    const result = await db.query(
                        "INSERT INTO customer (email, password_hash, first_name, last_name, date_of_birth, gender) VALUES ($1, $2 ,$3, $4, $5, $6) RETURNING *",
                        [email, hash, first_name, last_name, dob, gender]
                    );
                    const user = result.rows[0];
                    req.login(user, (err) => {
                        if (err) {
                            console.error("Error logging in user:", err);
                        } else {
                            console.log("Registration successful");
                            res.redirect("/dashboard");
                        }
                    });
                }
            });
        }
    } catch (err) {
        console.log(err);
    }
});

// Submit login
app.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/login",
    })
);

//logout
app.get("/logout", (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/login");
    });
});




// Change your Passport strategy configuration to properly handle the form fields
passport.use(
    new Strategy({
        usernameField: 'email',  // by default paaport.use expect username and password so im explicitly says the username as email 
        passwordField: 'password'   // This should match the form field name
    },
        async function verify(username, password, cb) {
            console.log("Executing passport.use local strategy...");
            try {
                const result = await db.query("SELECT * FROM customer WHERE email = $1", [username]);

                console.log("Query Result:", result.rows);

                if (result.rows.length > 0) {
                    const user = result.rows[0];
                    const storedHashedPassword = user.password_hash;

                    console.log("Stored Hashed Password:", storedHashedPassword);

                    bcrypt.compare(password, storedHashedPassword, (err, valid) => {
                        if (err) {
                            console.error("Error comparing passwords:", err);
                            return cb(err);
                        }
                        if (valid) {
                            console.log("Password Matched! Logging in...");
                            return cb(null, user);
                        } else {
                            console.log("Incorrect password!");
                            return cb(null, false, { message: 'Incorrect email or password' });
                        }
                    });
                } else {
                    console.log("User not found!");
                    return cb(null, false, { message: 'User not found' });
                }
            } catch (err) {
                console.log("Database Error:", err);
                return cb(err);
            }
        })
);

// Serialize user
passport.serializeUser((user, cb) => {
    cb(null, user.email);
});

// Deserialize user
passport.deserializeUser(async (email, cb) => {
    try {
        const result = await db.query("SELECT * FROM customer WHERE email = $1", [email]);

        const user = result.rows[0];
        if (user) {
            // Remove password hash before storing user in session
            delete user.password_hash;
            cb(null, user);
        } else {
            cb(new Error("User not found"));
        }
    } catch (err) {
        cb(err);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});
