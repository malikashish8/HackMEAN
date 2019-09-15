var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Post = mongoose.model('Post'),
  Comment = mongoose.model('Comment'),
  url = require("url");


exports.list_all_users = function(req,res) {
	User.find({}, 'username',function(err,user){
		if (err)
			res.send(err);
		res.json(user);
	})
}

exports.create_a_user = function(req,res){
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;
	if(!username || !password || !email){
    res.json({"message":"You are not sending user data in the specified format!","type":"error"});
    return;
  }
  else {
    // Check if user already exists
    User.findOne({"username": username},'username',function(err,user1){
      if(user1){
        res.json({"message":"This username is already taken. Use a different username.","type":"error"});
        return;
      }
      // Create user      
      var newUser = new User({"username": username, "password": password, "email": email})
      newUser.save(function(err, task) {
      if (err)
        res.json(err);
      var msg = "User "+username+" created in the database.";
      res.json({"message":msg,"type":"success"});
      });
    })
    
  }
}


exports.read_user_data = function(username, cb){
  User.findOne({"username": username}, function(err, userData) {
    if(userData){
      cb(null, userData);
    }
    else {
      cb(new Error("User not found"));
    }
  });
}
exports.update_password = function(req,res){}
exports.update_email = function(req,res){
  var username = req.body.username;
  var email = req.body.email;
  //Check if username and email are provided in the query
  if(!username || !email){
    res.json({"message":"You are not sending user data in the specified format!","type":"error"});
    return;
  }
  //Find the user in the DB
  User.findOne({"username":req.body.username},function(err,thisUser){
    //If user not found
    if(!thisUser){
      res.json({"message":"User not found!","type":"error"});
      return;
    }  
    //Update user email
    User.findOneAndUpdate({"username":req.body.username}, {"email":email}, function(err,user){
      if(err) {
        res.send(err);
        return;
      }
    res.json({"message":"User detail updated.","type":"success"});
    })
  })
  
}
exports.delete_user = function(req,res){
  User.remove({"username":res.body.username}, function(err,user){
    if (err)
      res.send(err);
    else
      res.json({message: 'User deleted', type:"success"});
  })
}

exports.list_all_posts = function(req,res){
  Post.find({}, function(err, posts){
    res.send(posts);
  })
}

exports.new_post = function(req, res){
  if(!req.body.user || !req.body.title || !req.body.body){
    res.status(400);
    res.json({"message":"You are not sending user data in the specified format!","type":"error"});
    return;
  }
  //Check if user exists in DB
  User.findOne({"username":req.body.user},function(err,user){
    if(!user){
      res.status(400);
      res.json({message: "Invalid user", type:"error"});
      return;
    }
    else if(err){
      console.log(err);
      res.status(500);
      res.json({message: 'Failed to connnect to DB', type: "error"});
      return;
    }
    var thisPost = new Post({"author": req.body.user, "title": req.body.title, "body": req.body.body});
    thisPost.time = new Date;
    thisPost.save(function(err, task){
      if(err){
        res.status(500);
        res.json({message: 'Failed to create post', type:"error"});
        console.log(err);
        return;
      }
      res.json({message: 'Post posted', post: task, type:"success"});
    });
  });
}
exports.delete_post = function(req, res){
  //res.set("Content-Type","application/json");
  if(!req.params.postId){
    res.status(400);
    res.json({"message":"You are not sending user data in the specified format!","type":"error"});
    return;
  }
  Post.findOne({_id: req.params.postId}, function(err, post){
    if(err){
      res.status(500);
      res.json(err);
      return;
    }
    if(!post){
      res.status(404);
      res.json({message: "Post not found!", type: "error"});
      return;
    }
    Post.remove({_id: req.params.postId}, function(err){
      if(err){
        res.status(500);
        res.json(err);
        return;
      } else
        res.json({message:"Post deleted", type: "success"});
      
    })
  })
}

exports.read_comments = function(req, res){
  Comment.find({}, function(err, comment){
    if(!err){
      res.json(comment);
      return;
    }
    else res.json({message: "Some error occurred!", type: "error"});
  })
}
exports.create_comment = function(req, res){
  var user = req.body.username;
  var message = req.body.message;
  var postId = req.body.postId;
	if(!user || !message || !postId){
    res.json({message:"You are not sending user data in the specified format!", type:"error"});
    return;
  }
  var comment = new Comment({user:user, message: message, postId: postId, time: new Date()});
  //fail if post does not exist
  if(Post.findById(postId,function(err, post){
    if(!post){
      res.json({message:"PostId does not match any post", type:"error"});
      return;
    }
    else{
      //fail if user does not exist
      if(User.findOne({username:user},function(err,existingUser){
        if(!existingUser){
          res.json({message:"User does not exist", type:"error"});
          return;
        } else {
          comment.save(function(err, task) {
            if (err) {
              res.json(err.json);
              return;
            }
            res.json({message:"Comment saved",type:"success"});
            });
        }
      })); 
    }
  }));
}
exports.delete_comment = function(req, res){
    if(!req.params.commentId){
        res.status(400);
        res.json({"message":"You are not sending user data in the specified format!","type":"error"});
        return;
    }
    Comment.findOne({_id: req.params.commentId}, function(err, comment) {
        if(err){
            res.status(500);
            res.json({message: "Something went wrong", type: "error"});
        } else if(comment){
            Comment.remove({_id: req.params.commentId}, (err, commentDeleted) =>{
            });
            res.json({message: "Comment deleted", type: "success"});
        } else if(!comment) {
            res.status(404);
            res.json({message: "Comment does not exist", type: "error"})
        }
    })
}