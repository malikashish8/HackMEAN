var mongoose = require('mongoose'),
  User = mongoose.model('User');

  export.list_all_users = function(req,res) {
  	User.find({}, function(err,user){
  		if (err)
  			res.send(err);
  		res.json(user);
  	})
  }