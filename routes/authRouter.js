const express = require("express");
const { Router } = express;

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const path = require("path");

const ContenedorMongo = require("../models/ContenedorMongo");
const User = new ContenedorMongo();

/**
 * Passport configuration
 */
passport.use(
  "login",
  new LocalStrategy((username, password, done) => {
    console.log("username", username);
    console.log("password", password);
    User.collection.findOne({ username: username }, (err, user) => {
      if (err) {
        console.log(err);
        return done(err);
      }
      if (!user) {
        console.log("User not found");
        return done(null, false, { message: "Incorrect username." });
      }
      if (!isValidPassword(user, password)) {
        console.log("invalid password");
        return done(null, false, { message: "Incorrect password." });
      }
      console.log(user);
      return done(null, user);
    });
  })
);

passport.use(
  "signup",
  new LocalStrategy(
    {
      passReqToCallback: true,
    },
    (req, username, password, done) => {
      console.log(username, password);
      User.collection.findOne({ username: username }, (err, user) => {
        if (err) {
          console.log("Signup error: ", err);
          return done(err);
        }
        if (user) {
          console.log("User already exists");
          return done(null, false, { message: "User already exists" });
        }
        const newUser = {
          username: username,
          password: createHash(password),
          email: req.body.email,
        };
        User.collection.create(newUser, (err, user) => {
          if (err) {
            console.log("Signup error: ", err);
            return done(err);
          }
          console.log("User created");
          return done(null, user);
        });
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.collection.findById(id, done);
});

const authRouter = new Router();

// Log user in if authenticated
authRouter.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/");
  } else {
    res.sendFile(path.join(process.cwd(), "/views/login.html"));
  }
});

authRouter.get("/register", (req, res) => {
  res.sendFile(path.join(process.cwd(), "/views/register.html"));
});

// Error state routes
authRouter.get("/failedlogin", (req, res) => {
  res.sendFile(path.join(process.cwd(), "/views/failedlogin.html"));
});
authRouter.get("/failedsignup", (req, res) => {
  res.sendFile(path.join(process.cwd(), "/views/failedRegister.html"));
});

// Log user out
authRouter.get("/logout", (req, res) => {
  const nombre = req.user?.username;
  req.logout();
  res.render(path.join(process.cwd(), "/views/logout.ejs"), { nombre });
});

authRouter.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/failedlogin",
    successRedirect: "/",
  })
);

authRouter.post(
  "/signup",
  passport.authenticate("signup", {
    failureRedirect: "/failedsignup",
    successRedirect: "/",
  })
);

// Utils
function createHash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

function isValidPassword(user, password) {
  return bcrypt.compareSync(password, user.password);
}

module.exports = authRouter;
