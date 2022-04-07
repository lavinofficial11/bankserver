//to give mongo db connection 

//mongoose import

const mongoose = require('mongoose')

//define connection string

mongoose.connect('mongodb://localhost:27017/Bankapp', {

})


//create modal

const User = mongoose.model('User', {
    acno: Number,
    uname: String,
    password: String,
    balance: Number,
    transactions: []


})

//export model-user

module.exports = {
    User
}