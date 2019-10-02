var mongoose = require('mongoose');
var config = require('config')

var User = mongoose.model('User');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var logger = require('../config/logger');
var jwt = require('jsonwebtoken');

var bcrypt = require('bcryptjs');

exports.list_all_users = function (req, res) {
  User.find({}, 'username', function (err, user) {
    if (err) { res.send(err); }
    res.json(user);
  })
}

exports.login = function (req, res) {
  if(req.body.username && req.body.password){
    loginUser({username: req.body.username, password: req.body.password}, (err) => {
      if(err) {
        logger.debug(err)
        res.status(401)
        res.json({"error": err.message})
      } 
      else {
        let jwtBearerToken = jwt.sign({}, process.env.private_key, {
          algorithm: 'RS256',
          expiresIn: config.sessionValidity,
          subject: req.body.username
        });
        res.json({"token": jwtBearerToken, expiresIn: config.sessionValidity});
      }
    });
  } else {
    logger.warn("auth failed: username and password not recieved");
    res.status(401);
    res.json({"message":"username or password incorrect","type":"error"});
  }
}

exports.logout = function(req, res) {
  res.json({"message": "user logged out"});
}

function loginUser(creds, cb) {
  User.findOne({ 'username': creds.username }, function (err, userData) {
    if (err) {
      cb(err);
    }
    else if (userData === null) {
      cb(new Error('username not found'));
    } else { 
      bcrypt.compare(creds.password, userData.password, (err, isSame) => {
        if(isSame) cb(null, true)
        else cb(new Error("incorrect password for " + userData.username))
      })
    }
  });
}

exports.create_a_user = function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;
  if (!username || !password || !email) {
    res.status(400).json({ 'message': 'You are not sending user data in the specified format!' });
  } else {
    var newUser = new User({ 
      'username': username, 
      'password': bcrypt.hashSync(password, config.bcrypt_rounds),
      'email': email 
    })
    newUser.save(function (err, task) {
      if (err) { res.status(400).json(err); }
      else{
        var msg = 'User ' + username + ' created in the database.';
        res.json({ 'message': msg });
      }
    });
  }
}

function throwError(res, err){
  var responseCode = 200;
  if(err instanceof InvalidRequestFormatError)
      responseCode = 400;
  res.status(responseCode);
  res.json({ 'message': err.message });
}

class InvalidRequestFormatError extends Error{}

exports.read_user_data = function (req, res) {
  User.findOne({username: req.body.username}, (err, user) => {
    if(err || !user) {
      res.status(400).json({"message": "user not found"});
    } else
    res.json({
      "_id": user._id,
      "username": user.username,
      "email": user.email
    });
  });
}
exports.update_password = function (req, res) {
  var username = req.params.username;
  var password = req.body.password;
  var newPassword = req.body.newPassword;
  // check if required fields are provided
  if (!username || !password || !newPassword) {
    throwError ( res, new InvalidRequestFormatError ('invalid format'));
    return;
  }
  // Find the user in the DB
  User.findOne({ 'username': username }, function (err, thisUser) {
    // if user not found
    if (!thisUser) {
      res.status(400).json({ 'message': 'User not found!' });
      return;
    }
    // Validate Password
    bcrypt.compare(password, thisUser.password, (err, isSame) => {
      if(isSame){
        User.findOneAndUpdate(
          { 'username': username },
          { 'password': bcrypt.hashSync(newPassword, config.bcrypt_rounds) }, 
          function (err, user) {
          if (err) {
            res.status(403).json({'message': err.message})
            return;
          }
          res.json({ 'message': 'User detail updated.' });
        })
      }
      else {
        res.status(401).json({"message": "wrong password"});
      }
    })
  })
}

exports.delete_user = function (req, res) {
  User.findOne({ 'username': req.params.username }, function (err, user) {
    if (err) { res.status(500).json(err); }
    else if (!user) { res.status(400).json({"message": "user not found"})}
    else {
      User.deleteOne({"username": user.username}, (err) => {
        if(err)
          res.json({"message": "something went wrong"});
        else
          res.json({ "message": "user removed" });
      });
    }
  });
}

exports.list_all_posts = function (req, res) {
  Post.find({}, function (err, posts) {
    res.send(posts);
  })
}

exports.get_post = function(req, res) {
  Post.find({ _id: req.params.postId }, (err, post) => {
    if(err)
      res.status(500).json({"message": "something went wrong"});
    else if(!post || post.length === 0) {
      res.status(400).json({"message": "something went wrong"});
    }
    else 
      res.send(post[0]);
  });
}

exports.update_post = function(req, res) {
  // logger.debug(jwt.decode(req.headers.authorization));
  Post.findOneAndUpdate(
    { _id: req.params.postId }, 
    { title: req.body.title, body: req.body.body }, 
    { new: true }, 
    (err, post) => {
      if(err)
        res.status(500).json({"message": "something went wrong"});
      else if(!post || post.length === 0) {
        res.status(400).json({"message": "post not found"});
      }
      else 
        res.send(post);
    });
}
exports.new_post = function (req, res) {
  if (!req.body.user || !req.body.title || !req.body.body) {
    res.json({ 'message': 'You are not sending user data in the specified format!', 'type': 'error' });
    return;
  }
  // Check if user exists in DB
  User.findOne({ 'username': req.body.user }, function (err, user) {
    if (!user) {
      res.json({ message: 'Invalid user', type: 'error' });
      return;
    } else if (err) {
      console.log(err);
      res.json({ message: 'Failed to connnect to DB', type: 'error' });
      return;
    }
    var thisPost = new Post({ 'author': req.body.user, 'title': req.body.title, 'body': req.body.body });
    thisPost.time = new Date();
    thisPost.save(function (err, task) {
      if (err) {
        res.json({ message: 'Failed to create post', type: 'error' });
        console.log(err);
        return;
      }
      res.json({ message: 'Post posted', type: 'success' });
    });
  });
}
exports.delete_post = function (req, res) {
  // res.set("Content-Type","application/json");
  if (!req.params.postId) {
    res.status(400);
    res.json({ 'message': 'You are not sending user data in the specified format!', 'type': 'error' });
    return;
  }
  Post.findOne({ _id: req.params.postId }, function (err, post) {
    if (err) {
      res.status(500);
      res.json(err);
      return;
    }
    if (!post) {
      res.status(404);
      res.json({ message: 'Post not found!', type: 'error' });
      return;
    }
    Post.remove({ _id: req.params.postId }, function (err) {
      if (err) {
        res.status(500);
        res.json(err);
      } else { res.json({ message: 'Post deleted', type: 'success' }); }
    })
  })
}

exports.read_comments = function (req, res) {
  Comment.find({}, function (err, comment) {
    if (!err) {
      res.json(comment);
    } else res.json({ message: 'Some error occurred!', type: 'error' });
  })
}

exports.get_comments_by_post = function (req, res) {
  let postId = req.params.postId;
  Comment.find({postId: postId}, function (err, comments) {
    if(!err) {
      res.json(comments);
    }
  });
}
exports.create_comment = function (req, res) {
  var user = req.body.username;
  var message = req.body.message;
  var postId = req.body.postId;
  if (!user || !message || !postId) {
    res.json({ message: 'You are not sending user data in the specified format!', type: 'error' });
    return;
  }
  var comment = new Comment({ user: user, message: message, postId: postId, time: new Date() });
  // fail if post does not exist
  if (Post.findById(postId, function (err, post) {
    if (!post) {
      res.json({ message: 'PostId does not match any post', type: 'error' });
    } else {
      // fail if user does not exist
      if (User.findOne({ username: user }, function (err, existingUser) {
        if(!existingUser) {
          res.json({ message: 'User does not exist', type: 'error' });
          
        } else {
          comment.save(function (err, task) {
            if (err) {
              res.json(err.json);
              return;
            }
            res.json({ message: 'Comment saved', type: 'success' });
          });
        }
      }));
    }
  }));
}
exports.delete_comment = function (req, res) {
  if (!req.params.commentId) {
    res.status(400);
    res.json({ 'message': 'You are not sending user data in the specified format!', 'type': 'error' });
    return;
  }
  Comment.findOne({ _id: req.params.commentId }, function (err, comment) {
    if (err) {
      res.status(500);
      res.json({ message: 'Something went wrong', type: 'error' });
    } else if (comment) {
      Comment.remove({ _id: req.params.commentId }, (err, commentDeleted) => {
      });
      res.json({ message: 'Comment deleted', type: 'success' });
    } else {
      res.status(404);
      res.json({ message: 'Comment does not exist', type: 'error' })
    }
  })
}
