module.exports = function(app) {
	var login = require('../controllers/logout_controller');
  var baseurl="/observatory/api";
	// Products Routes
	app.route(baseurl + '/logout')
		.post(login.logout_user);
};
