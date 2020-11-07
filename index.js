require('dotenv').config()//insert our .env here
const express = require('express')
const app = express()
const ejsLayouts = require('express-ejs-layouts')
const session = require('express-session')
const passport = require('./config/pp.Config.js')
const flash = require('connect-flash')
const isLoggedIn = require('./middleware/isLoggedIn')

//set ejs and ejs layouts
app.set('view engine', 'ejs')
app.use(ejsLayouts)

//body parse middleware (this makes req.body work); make sure above 'auth' controller middleware
app.use(express.urlencoded({extended:false}))

//sesssion middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}))

//passport middleware
app.use(passport.initialize())
app.use(passport.session()) 

//flash middleware
app.use(flash())

//CUSTOM MIDDLEWARE
app.use((req,res,next)=>{
    //before every route, attach the flash messages and current user to res.locals
    //this will give us access to these values in all our ejs pages 
    res.locals.alerts = req.flash()
    res.locals.currentUser = req.user
    next()//move on to the next piece of middlware
})

//use controllers
app.use('/auth', require('./controllers/auth.js'))

app.get('/', (req,res)=>{
   res.render('home')
})

app.get('/profile',isLoggedIn,(req,res)=>{
    res.render('profile')
})

app.listen(process.env.PORT, ()=>{
    console.log('listening to port 8000')
})