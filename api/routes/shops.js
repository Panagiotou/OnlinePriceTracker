module.exports = function(app) {
	var shops = require('../controllers/shops_controller');
  var baseurl="/observatory/api";
	// Products Routes
	app.route(baseurl + '/shops')
		.get(shops.list_shops)
		.post(shops.create_a_shop);

	app.route(baseurl + '/shops/:id')
		.get(shops.read_a_shop)
		.put(shops.update_a_shop)
    .patch(shops.partial_update_shop)
		.delete(shops.delete_a_shop);
};
