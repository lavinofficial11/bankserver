//import jsonwebtoken
const jwt = require('jsonwebtoken')


// import User 

const db = require('./db')




database = {
  1000: { acno: 1000, uname: "neer", password: 123, balance: 5000, transactions: [] },
  1001: { acno: 1001, uname: "vyom", password: 1001, balance: 5000, transactions: [] },
  1002: { acno: 1002, uname: "laisha", password: 1002, balance: 5000, transactions: [] }
}


//register defnition

const register = (acno, password, uname) => {

  //asynchronous 
  return db.User.findOne({ acno })
    .then(user => {
      if (user) {
        return {
          statuscode: 422,
          status: false,
          message: "already exist :( ,please login!!!!!"
        }
      }
      else {
        const newUser = new db.User({
          acno,
          uname,
          password,
          balance: 0,
          transactions: []

        })

        newUser.save()
        return {
          statuscode: 200,
          status: true,
          message: "registered sucessfully :)"
        }

      }
    })
}






//login defnition
const login = (acno, password) => {

  //asynchronous
  return db.User.findOne({ acno, password })
    .then(user => {
      if(user){
        currentAcno = acno;
      currentUname = user.uname

      //token generation
      const token = jwt.sign({
        currentAcno: acno

      }, 'supersecretkey1234')

      return {
        statuscode: 200,
        status: true,
        message: " sucessfully login :)",
        currentAcno,
        currentUname,
        token
      }
    }
    else{
      return {
        statuscode: 422,
        status: false,
        message: "incorrect password/Account number :("
      }

    }
  })
}
  
   


// deposit

const deposit = (acno, password, amt) => {

  var amount = parseInt(amt)

//asynchronopus
return db.User.findOne({acno,password})
.then(user=>{
  if(user){
    user.balance+=amount
    user.transactions.push({
      amount: amount,
      type: "CREDIT"
    })
    user.save()
    return {
      statuscode: 200,
        status: true,
        message: amount + "balance updated for the account" + user.balance
    }
  }
  else{
    return {
      statuscode: 422,
      status: false,
      message: "password incorrect :("
  }
}
})
}




//withdeaw

const withdraw = (req,acno, password, amt) => {

  var amount = parseInt(amt)
  var currentAcno=req.currentAcno
//asynchrpnous
return db.User.findOne({acno,password})
.then(user=>{
  if(user){
  if(currentAcno !=acno){
    return {
      statuscode: 422,
      status: false,
      message: "operation denied!!!!"
    }
  }
  
    if(user.balance>amount){
    user.balance-=amount
    user.transactions.push({
      amount: amount,
      type: "DEBIT"
    })
    user.save()
    return {
      statuscode: 200,
        status: true,
        message: amount + "sucessfully debitted ..and new balance is" + user.balance
    }
  }
  else{
    return {
      statuscode: 422,
      status: false,
      message: "insufficient balance"
  }
}
}
else{
  return {
    statuscode: 422,
    status: false,
    message: "incorrect password/account number"
}
}

})
}
  

//transactioin

const getTransaction = (acno) => {

  //asynchronous

  return db.User.findOne({acno})
  .then(user=>{
    if (user) {
      return {
        statuscode:200,
        status:true,
        transaction: user.transactions
      }
    }
    else{
      return {
        statuscode: 422,
        status: false,
        message:"user doesnot exist!!!!"
      }

    }

  })

}


//delete api

const deleteAcc =(acno)=>{
  //asynchronous
  return db.User.deleteOne({acno})
  .then(user=>{
    if(!user){
      return{
        statuscode: 422,
        status: false,
        message:"operation failed!!!!"

      }
    }
    return{
      statuscode:200,
        status:true,
        message:"the requested account number "+acno+"deleted sucessfully"
    }
  })
}




module.exports = {
  register,
  login,
  deposit,
  withdraw,
  getTransaction,
  deleteAcc


}