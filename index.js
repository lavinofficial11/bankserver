//import express


const express = require("express");
const { get } = require("express/lib/response");


const dataService = require('./services/data services')

//
const jwt = require('jsonwebtoken')

//importing cors

const cors =require('cors');
const res = require("express/lib/response");

//creating an app using express

const app = express()

//use cors to specify orgin 

app.use(cors({
    origin:'http://localhost:4200'
}))

//to parse json

app.use(express.json())

//setup the port no

app.listen(3000, () => {
    console.log("server started at port no:3000");
})

//resolve http request
//GET to read data

app.get('/', (req, res) => {
    res.send("It's a GET functn")
})

//post-to create data

app.post('/', (req, res) => {
    res.send("It's a post methord")
})

//put-to update/modify data
app.put('/', (req, res) => {
    res.send("It's a put methord")
})

//PATCH-to update partially data
app.patch('/', (req, res) => {
    res.send("It's a patch methord")
})

//DELETE-to delete data
app.delete('/', (req, res) => {
    res.status(401).send("It's a delete methord")
})

//application specific middleware

const appMiddleware = (req, res, next) => {
    console.log("application specific middleware")          //middleware
    next()
}
app.use(appMiddleware)


//bank app-API//////////////////////////////////////////////////////////////////////////////////////////////////////

//to verify token-middleware

const jwtmiddleware = (req, res, next) => {
    try {
        const token = req.headers["x-acess-token"]
        //verify token
        const data = jwt.verify(token, 'supersecretkey1234')
        req.currentAcno = data.currentAcno
        next()

    }
    catch {
        res.status(422).json({
            statusbar: 422,
            status: false,
            message: "please login"

        })
    }

}


//register API


app.post('/register', (req, res) => {
    //asynchronous

    dataService.register(req.body.acno, req.body.password, req.body.uname)
        .then(result => {
            res.status(result.statuscode).json(result)
        })

})


//login API


app.post('/login', (req, res) => {

    //asynchronous
     dataService.login(req.body.acno, req.body.password)
     .then(result => {
        res.status(result.statuscode).json(result)
     })
    }) 

//deposit API


app.post('/deposit', jwtmiddleware, (req, res) => {
    //asynchronous
     dataService.deposit(req.body.acno, req.body.password, req.body.amt)
     .then(result=>
        {res.status(result.statuscode).json(result)
    })
    
})


//withdraw API


app.post('/withdraw', jwtmiddleware, (req, res) => {
    //asynchronous
    dataService.withdraw(req,req.body.acno, req.body.password, req.body.amt)
    .then(result=>{ res.status(result.statuscode).json(result)})
   
})


//transaction
app.post('/transaction', jwtmiddleware, (req, res) => {
    //asynchronous
     dataService.getTransaction(req.body.acno)
   .then(result=>{
        res.status(result.statuscode).json(result)
    })
})

//deleteAcc api

app.delete('/deleteAcc/:acno',(req,res)=>{
    dataService.deleteAcc(req.params.acno)
    .then(result=>{
        res.status(result.statuscode).json(result);
    })
})

//setup a port number

