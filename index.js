require("dotenv").config();
const express = require('express');
const session = require('express-session');
const passport = require("passport");
const strategy = require("./strategy");

const app = express();
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true,
}));
app.use(passport.initialize());
app.use(passport.session());
    passport.use(strategy);

passport.serializeUser((user,done)=>{
    done(null,{
        id:user.id,
        displayName:user.displayName,
        nickname:user.nickname,
        email:user.emails[0]
    });
})

passport.deserializeUser((obj,done)=>{
    done(null,obj);
})

app.get("/login",passport.authenticate("auth0",{
    successRedirect:"/me",
    failureRedirect:"/login",
    failureFlash:true
}));

app.get("/me",(req,res)=>{
    console.log(req.user)
    if(req.user){
        res.status(200).json(JSON.stringify(req.user));
    }
    else{
        res.redirect("/login");
    }
})



const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}`); } );