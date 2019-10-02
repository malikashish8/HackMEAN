'use strict';

const mongoose = require('mongoose');
const config = require('config');

mongoose.connect(config.mongoURL, { useCreateIndex: true, useNewUrlParser: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: true
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
  },
  visibility: {
    type: String,
    require: true
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

module.exports = { User, Post, Comment };
