module.exports = function(app) {
	var login = require('../controllers/login_controller');
  var baseurl="/observatory/api";
	// Products Routes
	app.route(baseurl + '/login')
		.post(login.login_user);
};
