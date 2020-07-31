// name, contact number, address, education , date of birth, jiob title, photo
const mongoose = require('mongoose')
const slugify = require('slugify')
const Schema= mongoose.Schema



const userSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    contact: {
        type: Number
    },
    email: {
        type: String
    },
    address: {
        type: String
    },
    education: {
        type: String
    },
    birthday: {
        type: Date,
        trim: true
    },
    job: {
        type: String
    },
    photo: {
        type: String
    },
    slug: {
        type: String
    },
    password:{
        type: String
    }
})

// userSchema.pre('validate', function(next) {
//     if(this.name){
//         this.slug = slugify(this.name, {lower: true, strict: true})
//     }
//     next()
// })

const User = mongoose.model('testUser', userSchema)
module.exports = User