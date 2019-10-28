'use strict';

//gatehrs dependecies in one place and expanding it

const express = require('express');
const app = express();

const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use(express.urlencoded({extended:true}));

// BASIC AUTHENTICATION
//Creating a token via user credentials that they pass.

//1. Define route for handling basic auth requests. use http methods for creating
app.post('/signup')
app.post('/signin') //have specific headers we check

const users = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { tyoe: String, required: true },
  email: { type: String, required: true },
})

//2. Create a use model: a mongoose model with methods. Put methods directly onto a mongoose model without extending a class.
//Want methods to handle user auth operations: 
// - Hashing passwords (look at every character in a string and change around characters a certain number of times. bcrypt does this)
// Only 1 way so passwords cannot be recovered.
// - Comparing values to passwords
// - Generate a token

//static does not use a new instance, it uses a constructor. Mongoose has static methods on it. 
//@params {object} auth - {username, password}
//have mongoose run a query on DB. 
users.statics.authenticateBasic = (auth) => {}

//@params {string} password - het bcrypt, does this value = your instance password when you encrypt it?
users.methods.comparePassword = () => {}

//@params {void} - creates a token using user properties
users.methods.generateToken = () => {}

const userModel = mongoose.model('users', users);

//3. Creating auth middleware that will handle any request data that relates to auth . Checks for headers 
function handleAuth(req, res, next) {
  //parse reqs for header values
  //req.headers.authorization.split(' ');

  switch(authString) {
    //decide wether we are using a basic or bearer
  }

  //unincrypt the authString
  function _authbasic(auth) {

  }
  //send errors if issues occur (401)
  function _authenticate() {

  }

  function _authError() {
    //pass to some error handeling middleware
    next('Auth Error');
  }

};

//Starts the req/res cycle
app.listen(3000, () => {
  console.log('Server up')
});
