var readFile = require('fs').readFile;
var model = require('../api/hackmean_model');
var bcrypt = require('bcrypt');
var logger = require('../config/logger');
var config = require('config')

var User = model.User;
var Post = model.Post;
var Comment = model.Comment;
_ = require('lodash');

function populateMock () {
  readFile('./mock/mockdata.json', 'utf8', function (err, mockData) {
    mockData = JSON.parse(mockData);
    // hash passwords
    mockData.users.forEach(user => {
      user.password = bcrypt.hashSync(user.password, config.bcrypt_rounds);
    })
    User.insertMany(mockData.users, (err, users)=>{
      if(!err){
        mockData.posts.forEach(post => {  
          post.author = _.sample(users).username;
          post.time = new Date();
        });
        Post.insertMany(mockData.posts, (err, posts) => {
          if(!err){
            mockData.comments.forEach(comment => {
              comment.user = _.sample(users).username;
              comment.time = new Date();
              comment.postId = _.sample(posts).id;
            });
            Comment.insertMany(mockData.comments, (err) => {
              if(!err) logger.info("initialzed mock data in db");
            });
          }
        });
      }
    });
  });
}

module.exports = { populateMock };