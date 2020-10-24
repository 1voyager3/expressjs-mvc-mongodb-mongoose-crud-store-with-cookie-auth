// by convention name of imported class names with capital letter
const Product = require("../models/product");
const Order = require("../models/order");


exports.getProducts = (request, response, next) => {

    // find() is mongoose static method
    Product.find()
            .then(products => {

                response.render("shop/product-list", {
                    prods: products,
                    pageTitle: "All Products",
                    path: "/products",
                    isAuthenticated: request.isLoggedIn
                });
            })
            .catch(err => console.log(err));
};


exports.getProduct = (request, response, next) => {

    const prodId = request.params.productId;

    // findById() is mongoose static method
    Product.findById(prodId)
            .then((product) => {

                response.render("shop/product-detail", {
                    product: product,
                    pageTitle: product.title,
                    path: "/products",
                    isAuthenticated: request.isLoggedIn
                });
            })
            .catch(err => console.log(err));

};

exports.getIndex = (request, response, next) => {

    Product.find()
            .then(products => {

                response.render("shop/index", {
                    prods: products,
                    pageTitle: "Shop",
                    path: "/",
                    isAuthenticated: request.isLoggedIn
                });
            })
            .catch(err => console.log(err));

};

exports.getCart = (request, response, next) => {

    request.user
            // use populate() mongoose method to fetch all of products data in the cart
            .populate("cart.items.productId")
            // use execPopulate() to execute populate('cart.items.productId')
            .execPopulate()
            .then(user => {

                const products = user.cart.items;

                response.render("shop/cart", {
                    pageTitle: "Your Cart",
                    path: "/cart",
                    products: products,
                    isAuthenticated: request.isLoggedIn
                });
            })
            .catch(err => console.log(err));
};


exports.postCart = (request, response, next) => {

    const prodId = request.body.productId;

    Product.findById(prodId)
            .then(product => {

                return request.user.addToCart(product);

            })
            .then(result => {

                response.redirect("/cart");
            })
            .catch(err => {
                console.log(err);
            });

};

exports.postCartDeleteProduct = (request, response, next) => {

    const prodId = request.body.productId;

    request.user.removeFromCart(prodId)
            .then(result => {
                response.redirect("/cart");
            })
            .catch(err => console.log(err));

};

exports.postOrder = (request, response, next) => {

    request.user
            .populate("cart.items.productId")
            .execPopulate()
            .then(user => {

                const products = user.cart.items.map(i => {
                    // { ...i.productId._doc } pulls all data from a product
                    return { quantity: i.quantity, product: { ...i.productId._doc } };
                });

                const order = new Order({
                    user: {
                        name: request.user.name,
                        userId: request.user
                    },
                    products: products
                });

                return order.save();

            })
            .then(result => {
                        return request.user.clearCart();
                    }
            )
            .then(() => {
                response.redirect("/orders");
            })
            .catch(err => {
                console.log(err);
            });
};

exports.getOrders = (request, response, next) => {

    Order.find({ "user.userId": request.user._id })
            .then(orders => {

                response.render("shop/orders", {
                    pageTitle: "Your Orders",
                    path: "/orders",
                    orders: orders,
                    isAuthenticated: request.isLoggedIn
                });
            })
            .catch(err => console.log(err));

};


















