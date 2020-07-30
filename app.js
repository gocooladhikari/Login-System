const express = require('express')
const bodyparser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const expresslayout = require('express-ejs-layouts')
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
app.use(express.static(__dirname + '/public'))

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
    res.send('Homepage')
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log('Server running on port' + PORT)
})