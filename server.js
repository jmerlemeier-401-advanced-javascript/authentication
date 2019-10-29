'use strict';

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost:27017/class11', {
  useCreateIndex: true,
  useUnifiedTopology: true,
  useNewUrlParser: true,
})

const app = express();
app.use(morgan('dev'));
app.use(express.json());

//  Basic Authentication
// Creating our auth token from credentials that the user sends us:

// 1) Define route for handling basic auth requests
app.post('/signup', (req, res, next) => {
  let user = new UserModel(req.body);
  user.save()
    .then(user => {
      req.token = user.generateToken();
      req.user = user;
      res.set('token', req.token);
      res.cookie('auth', req.token);
      res.send(req.token);
    }).catch(next);
});
app.post('/signin', handleAuth, (req, res) => {
  res.cookie('auth', req.token);
  res.send(req.token);
});

// 2) Create a user model
//  a mongoose model with methods to handle user auth operations
//  Hashing passwords
//  comparing values to passwords
//  Generate a token
const users = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
});

users.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

// @params {object} auth - {username, password}
//  Looks for a user in our database by the given username
//  returns the comparePassword boolean method in order to check if the given passeword matches
users.statics.authenticateBasic = function (auth) {
  let query = { username: auth.username };
  return this.findOne(query)
    .then(user => user.comparePassword(auth.password));
}

// @ params {string} password - hey bcrypt, does this value equal your instance password when you encypt it?
users.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password)
    .then(isValid => isValid ? this : null);
}

// @params {void} - creates a token
users.methods.generateToken = function () {
  let userData = {
    id: this._id,
  }

  // create an encrypted token
  return jwt.sign(userData, process.env.SECRET);
}
const UserModel = mongoose.model('users', users);

// 3) Creating Auth middlware that will handle any request data that relates to auth
//  Check for auth header
//  decide whether our requests are authorized.
function handleAuth(req, res, next) {
  // parse reqs for header values
  //  req.headers.authorization.split(' ');
  const [authType, authString] = req.headers.authorization.split(' ');

  switch (authType.toLowerCase()) {
    // decide whether we are using basic or bearer
    case 'basic':
      return _authBasic(authString);
    default:
      return _authError();
  }

  // attach encoding the authstring
  function _authBasic(authString) {
    let base64Buffer = Buffer.from(authString, 'base64'); // <Buffer 01 03 >
    let bufferString = base64Buffer.toString(); // jacob:mysuperpasswrd
    let [username, password] = bufferString.split(':');
    let auth = { username, password };

    return UserModel.authenticateBasic(auth)
      .then(user => _authenticate(user));
  }

  // send errors if issues occur
  function _authenticate(user) {
    if (user) {
      req.token = user.generateToken();
      req.user = user;
      next();
    } else {
      _authError();
    }

  }

  function _authError() {
    next('Auth error');
  }
}


app.listen(3000, () => {
  console.log('app is listening on port 3000');
});