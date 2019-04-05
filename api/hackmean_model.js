const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config  = require('../config.json');

mongoose.connect(config.mongoURL);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    trim: true
  }
});

var postSchema = mongoose.Schema({
  author: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    required: true
  }
})
var commentSchema = mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  postId: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    required: true
  }
})

var User = mongoose.model('User', userSchema);
var Post = mongoose.model('Post', postSchema);
var Comment = mongoose.model('Comment', commentSchema);

// Create admin user if not already present in the DB
User.find({ username: /^admin/ }, function (err, admin) {
  if (err) {
    return console.error(err);
  } else if (admin.length === 0) {
    var admin = new User({ username: 'admin', password: bcrypt.hashSync('SuperSecureAdminPassword123@123',config.bcrypt_rounds), email: '' });
    admin.save().then(() => console.log('Admin user created in DB'));
  }
});

module.exports = { User, Post, Comment };
