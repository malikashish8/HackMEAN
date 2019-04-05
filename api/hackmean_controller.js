var mongoose = require('mongoose');
var User = mongoose.model('User');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var url = require('url');
var bcrypt = require('bcrypt');
var config = require('../config.json')

exports.list_all_users = function (req, res) {
  User.find({}, 'username', function (err, user) {
    if (err) { res.send(err); }
    res.json(user);
  })
}

exports.login = function (req, res) {
  User.findOne({ 'username': req.body.username, 'password': req.body.password }, function (err, data) {
    if (err || data === null) {
      res.status(401).json({ 'message': 'login failed' });
    } else { res.json({ 'message': 'login successful', 'user': data.username }); }
  });
}

exports.create_a_user = function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;
  if (!username || !password || !email) {
    res.json({ 'message': 'You are not sending user data in the specified format!', 'type': 'error' });
  } else {
    // Check if user already exists
    User.findOne({ 'username': username }, 'username', function (err, user1) {
      if (user1) {
        res.json({ 'message': 'This username is already taken. Use a different username.', 'type': 'error' });
        return;
      }
      // Create user
      var newUser = new User({ 
        'username': username, 
        'password': bcrypt.hashSync(password, config.bcrypt_rounds),
        'email': email 
      })
      newUser.save(function (err, task) {
        if (err) { res.json(err); }
        else{
          var msg = 'User ' + username + ' created in the database.';
          res.json({ 'message': msg, 'type': 'success' });
        }
      });
    })
  }
}
function throwError(res, err){
  var responseCode = 200;
  if(err instanceof InvalidRequestFormatError)
      responseCode = 400;
  res.status(responseCode);
  res.json({ 'message': err.message });
}
class InvalidRequestFormatError extends Error{

}
exports.read_user_data = function (req, res) {}
exports.update_password = function (req, res) {
  var username = req.params.username;
  var password = req.body.password;
  var newPassword = req.body.newPassword;
  // Check if username and email are provided in the query
  if (!username || !password || !newPassword) {
    throwError ( res, new InvalidRequestFormatError ('You are not sending user data in the specified format!'));
    return;
  }
  // Find the user in the DB
  User.findOne({ 'username': username }, function (err, thisUser) {
    // If user not found
    if (!thisUser) {
      res.json({ 'message': 'User not found!', 'type': 'error' });
      return;
    }
    // Validate Password
    User.findOneAndUpdate(
      { 'username': username, 'password': bcrypt.hashSync(password, config.bcrypt_rounds) },
      { 'password': bcrypt.hashSync(newPassword, config.bcrypt_rounds) }, 
      function (err, user) {
      if (err) {
        res.send(err);
        return;
      }
      res.json({ 'message': 'User detail updated.', 'type': 'success' });
    })
  })
}
exports.delete_user = function (req, res) {
  User.remove({ 'username': res.body.username }, function (err, user) {
    if (err) { res.send(err); }
    res.json({ message: 'User deleted', type: 'success' });
  })
}

exports.list_all_posts = function (req, res) {
  Post.find({}, function (err, posts) {
    res.send(posts);
  })
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
  console.log('Comments requested');
  Comment.find({}, function (err, comment) {
    if (!err) {
      res.json(comment);
    } else res.json({ message: 'Some error occurred!', type: 'error' });
  })
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
    } else if (!comment) {
      res.status(404);
      res.json({ message: 'Comment does not exist', type: 'error' })
    }
  })
}
