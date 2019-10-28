'use strict';

//gatehrs dependecies in one place and expanding it

const express = require('express');
const app = express();

const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use(express.urlencoded({extended:true}));

// BASIC AUTHENTICATION
//Creating a token via user credentials that they pass.

//1. Define route for handling basic auth requests. use http methods for creating
app.post('/signup', (req, res) => {
  let user = new UserModel(req.body);

  user.save()
    .then(user => {
      req.token = user.generateToken();
      req.user = user;
      res.set('token', req.token)//set response header
      res.cookie('auth', req.token) //sort of like local storage
      res.send(req.token);
    }).catch(next);
})
app.post('/signin', handleAuth, (req, res) => {//have specific headers we check
  //use middleware
  res.cookie('auth', req.token);
  res.send(req.token);
}) 


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
users.statics.authenticateBasic = (auth) => { 
  let query = {username: auth.username};
  return this.findOne(query)
    .then(user => user.comparePassword(auth.password));
}

//@params {string} password - het bcrypt, does this value = your instance password when you encrypt it?
users.methods.comparePassword = (password) => {
  return bcrypt.compare(password, this.password)
    .then(isValid => valid ? this : null);
 }

//@params {void} - creates a token using user properties
users.methods.generateToken = () => { 
  let userData = {
    id: this._id,
  }
  //library used to create an incrypted token
  return jwt.sign(userData, process.env.SECRET);
}

const UserModel = mongoose.model('users', users);

//3. Creating auth middleware that will handle any request data that relates to auth . Checks for headers 
function handleAuth(req, res, next) {
  //parse reqs for header values
  //req.headers.authorization.split(' ');
//authstring (base64 encrypted)
//authtype(basic)
  const [authType, authString] = req.headers.authorization.split(' ');

  switch(authType) {//basic, bearer, undefined
    //decide wether we are using a basic or bearer
    case 'basic':
      return _authBasic(authString);
    default:
        return _authError();
  }

  //encode the authString
  function _authbasic(authString) {
    let base64Butter = Buffer.from(authString, 'bas64');
    let bufferstring = base64Buffer.toString(); jacob:mysuperpassword
    let [username, password] = bufferString.split(':');
    let auth = { username, password };

    return UserModel.authenticateBasic(auth)
      .then(user => _authenticate(user));
  }
  //send errors if issues occur (401)
  function _authenticate() {
    if(user){
      req.token = user.generateToken();
    }

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
