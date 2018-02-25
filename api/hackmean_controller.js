var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Post = mongoose.model('Post'),
  Comment = mongoose.model('Comment');


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
//

exports.read_user_data = function(req,res){}
exports.update_email = function(req,res){
  var username = req.body.username;
  var email = req.body.email;
  //Check iF username and email are provided in the query
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
    res.json({"message":"You are not sending user data in the specified format!","type":"error"});
    return;
  }
  //Check if user exists in DB
  User.findOne({"username":req.body.user},function(err,user){
    if(!user){
      res.json({message: "Invalid user", type:"error"});
      return;
    }
  });

  var thisPost = new Post({"author": req.body.user, "title": req.body.title, "body": req.body.body});
  thisPost.time = new Date;
  thisPost.save(function(err, task){
    if(err){
      res.json({message: 'Failed to create post', type:"error"})
      console.log(err);
      return;
    }
    res.json({message: 'Post posted', type:"success"});
  });
}
exports.delete_post = function(req, res){
  if(!req.body._id){
    res.json({"message":"You are not sending user data in the specified format!","type":"error"});
    return;
  }
  Post.findOne({_id: req.body._id},function(err, post){
    if(err){
      res.json(err);
      return;
    }
    if(!post){
      res.json({message: "Post not found!", type: "error"});
      return;
    }
    Post.remove({_id: req.body._id},function(err){
      if(err){
        res.json(err);
        return;
      }
        res.json({message:"Post deleted", type: "success"});
      
    })
  })
}

exports.read_comments = function(){}
exports.create_comment = function(){}
exports.delete_comment = function(){}