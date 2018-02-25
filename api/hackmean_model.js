const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mydb');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var userSchema = mongoose.Schema({
	username: { 
		type:String,
		unique: true,
		required: true,
		trim: true
	},
	password: {
		type:String,
		required: true
	},
	email: {
		type: String,
		trim: true,
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
	}
})
var commentSchema = mongoose.Schema({
	user: {
		type: String,
		required: true
	},
	message: {
		type: String,
		required:true
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

// Create admin user if not already present in the DB
User.find({ username: /^admin/ }, function(err, admin){
	if (err) {
		return console.error(err); 
	} else if (admin.length == 0){
		console.log(admin.length)
		var user1 = new User({ username: "admin", password: "SuperSecureAdminPassword123@123", email: ""});
		user1.save().then(() => console.log("Admin user created in DB"));
	} else{
		console.log("Admin found " + admin.length)	
	}
});

module.exports = User, Post, Comment;