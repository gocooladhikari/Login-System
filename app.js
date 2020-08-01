const express = require('express')
const bodyparser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const expresslayout = require('express-ejs-layouts')
const User = require('./model/User')
const path = require('path')
require('dotenv').config()

// Passport Config
require('./config/passport')(passport)

// MONGODB Connection
mongoose.connect(process.env.MONGO_URI, {useUnifiedTopology: true, useNewUrlParser: true}, () => {
    console.log('DB connected')
})

const app = express()

// Body-Parser 
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))

// Static directory
app.use(express.static(path.join(__dirname, 'public')))


// EJS and ejs layout setup
app.use(expresslayout)
app.set('view engine', 'ejs')

// Express session
app.use(
    session({
        secret: 'task',
        resave: true,
        saveUninitialized: true
    })
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())


// Routes
app.use('/user', require('./routes/user'))


app.get('/', (req, res) => {

    if(req.isAuthenticated()){
        res.render('home', {title: 'Task-1', user: req.user})
    }else{
        res.render('home', {title: 'Task-1', user: null})

    }
    
})


// ({$or: [{'education' : {$regex: q, $options: 'i'}}, {'name' : {$regex: q, $options: 'i'}}]})

app.get('/search/', (req, res) => {
    var q = req.query.name

    User.find({$or: [{'education' : {$regex: q, $options: 'i'}}, {'name' : {$regex: q, $options: 'i'}}]}).then(data => {
        if(!data){
            res.send('No data')
        }else{
            console.log(q)
            res.send(data)
        }
        
    }).catch(err => console.log(err))
})

app.get('/time', (req, res) => {
    // res.render('time', {title: 'Time', user: null})
    var d = new Date()
    var day = d.getDate()
    var month = d.getMonth() + 1
    var year = d.getFullYear()
    var date = day + '/' + month + '/' + year

    console.log(d)
    console.log(date)
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log('Server running on port' + PORT)
})