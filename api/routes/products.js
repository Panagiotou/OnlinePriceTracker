module.exports = function(app) {
	var products = require('../controllers/products_controller');
  var baseurl="observatory/api";
	// Products Routes
	app.route(baseurl + '/products')
		.get(products.list_products)
		.post(products.create_a_product);

	app.route(baseurl + '/products/:id')
		.get(products.read_a_product)
		.put(products.update_a_product)
    .patch(products.partial_update_product)
		.delete(products.delete_a_product);
};
