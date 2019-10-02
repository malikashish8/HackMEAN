var readFile = require('fs').readFile;
var model = require('../api/hackmean_model');
var bcrypt = require('bcryptjs');
var logger = require('../config/logger');
var config = require('config')

var User = model.User;
var Post = model.Post;
var Comment = model.Comment;
_ = require('lodash');

function populateMock () {
  readFile('./mock/mockdata.json', 'utf8', function (err, mockData) {
    if(err) {
      logger.error(err.message);
      process.exit(err.errno);
    }
    mockData = JSON.parse(mockData);
    // hash passwords
    mockData.users.forEach(user => {
      user.password = bcrypt.hashSync(user.password, config.bcrypt_rounds);
    });
    User.insertMany(mockData.users, (err, users)=>{
      if(!err){
        mockData.posts.forEach(post => {  
          post.author = _.sample(users).username;
          post.time = new Date(new Date() - 99999999999 * Math.random());
          post.visibility = Math.random() > 0.5 ? 'public' : 'private';
        });
        Post.insertMany(mockData.posts, (err, posts) => {
          if(!err){
            mockData.comments.forEach(comment => {
              comment.user = _.sample(users).username;
              let selectedPost = _.sample(posts)
              comment.postId = selectedPost.id;
              comment.time = new Date(new Date() - (new Date() - selectedPost.time) * Math.random())
            });
            Comment.insertMany(mockData.comments, (err) => {
              if(!err) logger.info("mock data initialized in db");
            });
          }
        });
      }
    });
  });
}

module.exports = { populateMock };