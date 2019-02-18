module.exports = function(app) {
	var prices = require('../controllers/prices_controller');
  var baseurl="/observatory/api";
	// Prices Routes
	app.route(baseurl + '/prices')
		.get(prices.list_prices)
		.post(prices.create_a_price);
};
