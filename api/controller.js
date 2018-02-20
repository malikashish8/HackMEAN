var mongoose = require('mongoose'),
  User = mongoose.model('User');

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
  //Check is username and email are provided in the query
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
