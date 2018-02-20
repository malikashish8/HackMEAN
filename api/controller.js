var mongoose = require('mongoose'),
  User = mongoose.model('User');

  exports.list_all_users = function(req,res) {
  	User.find({}, function(err,user){
  		if (err)
  			res.send(err);
  		res.json(user);
  	})
  }

  exports.create_a_user = function(req,res){
  	console.log("res: "+res)
  	console.log("res.body: "+res.body)
  	console.log("res.body.user: "+res.body.user)

  }
  exports.read_user_data = function(req,res){}
  exports.update_user = function(req,res){}
  exports.delete_user = function(req,res){}
