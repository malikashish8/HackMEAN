module.exports = function(app) {
	var hackMEAN = require('./controller');

	//hackMEAN Routes
	app.route('/user')
	.get(hackMEAN.list_all_users)
	.post(hackMEAN.create_a_user);

	app.route('/user/:username')
	.get(hackMEAN.read_user_data)
	.put(hackMEAN.update_email)
	.delete(hackMEAN.delete_user);
};