'use strict';

//talks to DB
//handles our persistence layer
//Define schema here - the properites we want to persist

//what info do we require from our users.

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const users = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  email: {type: String},
  role: {type: String, required: true, default:'user', enum:['admin','editor','user'] },
});

users.pre('save', async function() {
  console.log('about to save')
  if (this.isModified('password'))
  {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

/**
 * @returns {Boolean}
 */
users.statics.authenticateBasic = function(auth) {
  let query = {username:auth.username};
  return this.findOne(query)
    .then(user => user.comparePassword(auth.password))
    .catch(console.error);
};

// Compare a plain text password against the hashed one we have saved
/**
 * @returns {object} - {username, password, email}
 */
users.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password)
  .then(isValid => isValid ? this : null);
};

// Generate a JWT from the user id and a secret
users.methods.generateToken = function() {
  let tokenData = {
    id:this._id,
    capabilities: (this.acl && this.acl.capabilities) || [],
  };
  return jwt.sign(tokenData, process.env.SECRET || 'changeit' );
};

module.exports = mongoose.model('users', users);