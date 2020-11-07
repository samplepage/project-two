const express = require('express')
const db = require('../models')
const router = express.Router()
const passport = require('../config/pp.Config.js')


router.get('/signup', (req,res)=>{
    res.render('auth/signup')
})

router.post('/signup',(req,res)=>{
    console.log('sign up form user input:', req.body) 
    //redirect to login page
    db.user.findOrCreate({
        where:{email:req.body.email},
        defaults:{
            name:req.body.name,
            password:req.body.password
        }
    })
    .then(([created,wasCreated])=>{ 
        if(wasCreated){ //wasCreated is a boolean
        passport.authenticate('local',{
            successRedirect:'/',
            successFlash:'account created and logged in!' //Flash message added using passport 
        })(req,res)//IIFE = immediately invoked function 
        } else {
            //console.log('An account assoeciated with that email address already exists! try loggin in.')
            req.flash('error', 'email already exists')
            res.redirect('/auth/login')
        }
        //res.redirect('/auth/login')
    })
    .catch(err=>{
        req.flash('error',err.message)//Flash 
        res.redirect('/auth/signup')//redirect to signup page so they can try again
    })
    
})

router.get('/login', (req,res)=>{
    //res.send('GET /login successfully hit')
    res.render('auth/login')
})

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/auth/login',
    successRedirect:'/',
    failureFlash: 'invalid email or password',
    successFlash: 'you are now logged in'
}))




router.get('/signup', (req, res)=>{
    res.send('GET /auth/signup successfully hit')
})


router.get('/logout', (req,res)=>{
    req.logout()
    req.flash('success','succesfully logged out')//flash
    res.redirect('/')
})

module.exports = router


