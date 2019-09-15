module.exports = function (app) {
	var hackMEAN = require('./hackmean_controller');
	

  // hackMEAN Routes
	app.route('/user')
		.get(hackMEAN.list_all_users)
		.post(hackMEAN.create_a_user);
	
	app.route('/user/:username')
		.get(hackMEAN.read_user_data)
		.put(hackMEAN.update_password)
    .delete(hackMEAN.delete_user);

  app.route('/post')
    .get(hackMEAN.list_all_posts)
    .post(hackMEAN.new_post)

  app.route('/post/:postId')
    .delete(hackMEAN.delete_post);

  app.route('/comment')
    .get(hackMEAN.read_comments)
    .post(hackMEAN.create_comment);

  app.route('/comment/:commentId')
    .delete(hackMEAN.delete_comment);

  app.route('/login')
    .post(hackMEAN.login);
};
