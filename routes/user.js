const router = require('express').Router()
const multer = require('multer')
const passport = require('passport')
const slugify = require('slugify')

// DB models
const User = require('../model/User')

// Authentication
const{forwardAuthenticated, ensureAuthenticated} = require('../config/auth')

// Multer Setup
const storage = multer.diskStorage({
    destination: (req, filename, cb) => {
        cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true)
    }else{
        cb(null, false)
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
})


// Routes

// Display All route
router.route('/').get(ensureAuthenticated, (req, res) => {
    User.find().then(user => {
        res.send(user)
    }).catch(err => console.log(err)) 
})

// Registration route
router.route('/register').get(forwardAuthenticated, (req, res) => {
    res.render('register', {title: 'Register', user: null})
})

router.route('/register').post(upload.single('photo'), (req, res) => {
    const{name, address, contact, education, job, email, password, password2} = req.body
    const slug = slugify(name, {lower: true, strict: true})
    const photo = req.file.path.replace(/\\/g, '/')

    // console.log(photo)
    User.findOne({email}).then(user => {
        if(user){
            console.log('User already registered')
        }else{
            if(password !== password2){
                console.log('passwords dont match')
            }else{
                const user = new User({
                    name, 
                    address,
                    contact,
                    education,
                    job,
                    email,
                    password,
                    slug,
                    photo
                })

                user.save().then(user => {
                    console.log(user.slug)
                    res.render('dashboard', {title: user.name, user: user})
                }).catch(err => console.log(err))
            }
        }
    }).catch(err => console.log(err))
    
})



// Login Route
router.route('/login').get(forwardAuthenticated, (req, res) => {
    res.render('login', {title: 'Login', user: null})
})

router.route('/login').post((req, res, next) => {
    const {email, password} = req.body
    User.findOne({email}).then((user) => {
        passport.authenticate('local', {
            successRedirect: `/user/${user.slug}/dashboard`,
            failureRedirect: '/user/'
        })(req, res, next)
    })
})

// User Dashboard
router.route('/:slug/dashboard').get(ensureAuthenticated, (req, res) => {
    
    User.findOne({slug: req.params.slug}).then(user => {
        if(!user){
            console.log('Invalid URL')
            res.send('404 not found')
        }else{
            res.render('dashboard', {title: user.name, user: user})
        }
    }).catch(err => console.log(err))
    
})


// logout route
router.route('/logout').get((req, res) => {
    req.logout()
    res.redirect('/')
})

module.exports = router