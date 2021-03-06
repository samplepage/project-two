require('dotenv').config()//insert our .env here
const express = require('express')
const app = express()
const ejsLayouts = require('express-ejs-layouts')
const session = require('express-session')
const passport = require('./config/pp.Config.js')
const flash = require('connect-flash')
const isLoggedIn = require('./middleware/isLoggedIn')
const db = require('./models')
const axios = require('axios')

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

//-----------patient post route
app.post('/patient',isLoggedIn,(req,res)=>{
    db.patient.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        age: req.body.age,
        email: req.body.email,
        symptoms: req.body.symptoms,
        userId:req.body.userId
    })
    .then(patient => {
        console.log(`@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@${patient.firstName}`)
        res.render('home.ejs',{patient})//ejs now has access to the patient variable 
    })
    .catch(error => {
        console.log(`you encountered an error ${error}`)
    })
}) 

//patient get route 
app.get('/patient', (req,res)=>{
    res.render('patient.ejs')
})

app.get('/', (req,res)=>{
   res.render('home')
})

//---------GET patient-profile 
app.get('/patient-profile', isLoggedIn, (req,res)=>{
    db.patient.findOne({where:{id:req.query.id}})
    .then(patient=>{
const data = JSON.stringify({text: patient.symptoms, age: {value:patient.age}}); //req.body
const config = {
  method: 'post',
  url: 'https://api.infermedica.com/v3/parse',
  headers: { 
    'App-Id': 'a7812a3e', 
    'App-Key': 'fc790b7e1c4cc666e7747f76126a1e0f', 
    'Content-Type': 'application/json'
  },
  data : data
};
axios(config)
.then(response => {
  console.log(response.data);
  let arr = [];
  response.data.mentions.forEach(mention=>{
      //console.log(mention.id)
      arr.push({"id": mention.id, "choice_id": mention.choice_id})
      //console.log(mention.choice_id)
  })
  //write json
  const data = JSON.stringify({"sex": "male", "age": {"value": 30}, "evidence": arr}); 
  const config = {
    method: 'post',
    url: 'https://api.infermedica.com/v3/diagnosis',
    headers: { 
        'App-Id': 'a7812a3e', 
        'App-Key': 'fc790b7e1c4cc666e7747f76126a1e0f', 
        'Content-Type': 'application/json'
    },
    data : data
  };
  console.log(data)
  axios(config)
  .then(response =>{
      console.log(response.data.conditions)
      patient.conditions = response.data.conditions
      res.render('patient-profile.ejs', {patient})
  })
})
.catch(error => {
  console.log(error);
});
    })
    //res.send('test')
})

//------GET PROFILE--------
app.get('/profile',isLoggedIn,(req,res)=>{
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
    console.log(req.session)
    db.patient.findAll({
        where: {userId: req.session.passport.user}
    })
    .then(patients => {
        console.log(patients)
        //let patientCondition = []
        /*patients.forEach(patient =>{

        })*/
        res.render('profile.ejs', {patients})
    })
    .catch(error => {
        console.log(`you encountered an error ${error}`)
    })
})
//---------GET Profile Delete Patient----------
app.get('/deletePatient',isLoggedIn,(req,res)=>{
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
    console.log(req.session)
    console.log(req.query.patientId)
    db.patient.findOne({
        where: {id: req.query.patientId} 
    })
    .then(patient => {
        patient.destroy()
        //console.log(patient)
        console.log('patient was deleted')
        res.redirect('/profile')
    })
    .catch(error => {
        console.log(`you encountered an error ${error}`)
    }) 
})
//---------POST Update Patient-------
app.post('/updatePatient',isLoggedIn,(req,res)=>{
    db.patient.findOne({
        where: {id:req.body.patientId}
    })
    .then(patient =>{
        patient.update({symptoms:req.body.symptoms})
        res.redirect('/profile')
    })
    .catch(error =>{
        console.log(`you encountered an error ${error}`)
    })
})
//----------Infermedica API-----------
/*const data = JSON.stringify({text: "I still have a headahce.", age: {value:30}});
const config = {
  method: 'post',
  url: 'https://api.infermedica.com/v3/parse',
  headers: { 
    'App-Id': 'a7812a3e', 
    'App-Key': 'fc790b7e1c4cc666e7747f76126a1e0f', 
    'Content-Type': 'application/json'
  },
  data : data
};
axios(config)
.then(response => {
  console.log(response.data);
  let arr = [];
  response.data.mentions.forEach(mention=>{
      //console.log(mention.id)
      arr.push({"id": mention.id, "choice_id": mention.choice_id})
      //console.log(mention.choice_id)
  })
  //write json
  const data = JSON.stringify({"sex": "female", "age": {"value": 30}, "evidence": arr});
  const config = {
    method: 'post',
    url: 'https://api.infermedica.com/v3/diagnosis',
    headers: { 
      'App-Id': 'a7812a3e', 
      'App-Key': 'fc790b7e1c4cc666e7747f76126a1e0f', 
      'Content-Type': 'application/json'
    },
    data : data
  };
  //console.log(data)
  axios(config)
  .then(response =>{
      console.log(response.data.conditions)
  })
})
.catch(error => {
  console.log(error);
});*/



app.listen(process.env.PORT || 8000, ()=>{
    console.log('listening to port 8000')
})