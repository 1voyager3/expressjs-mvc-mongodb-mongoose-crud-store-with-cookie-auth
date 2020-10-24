const Product = require("../models/product");


exports.getAddProduct = (request, response, next) => {

    response.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
        isAuthenticated: request.isLoggedIn
    });
};

exports.postAddproduct = (request, response, next) => {

    const title = request.body.title;
    const imageUrl = request.body.imageUrl;
    const price = request.body.price;
    const description = request.body.description;

    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: request.user._id
    });

    // this save() is static method coming from mongoose
    product.save()
            .then(result => {
                console.log("Created product");

                response.redirect("/admin/products");
            })
            .catch(err => {
                console.log(err);
            });
};

exports.getEditProduct = (request, response, next) => {

    const editMode = request.query.edit;

    if (!editMode) {
        return response.redirect("/");
    }

    //params property is from router.get('/edit-product/:productId', adminController.getEditProduct)
    // located in controllers/admin.js
    // :productId is a value of params property
    const prodId = request.params.productId;

    // this findById() is static method coming from mongoose
    Product.findById(prodId)
            .then(product => {

                if (!product) {
                    return response.redirect("/");
                }

                response.render("admin/edit-product", {
                    pageTitle: "Edit Product",
                    path: "/admin/edit-product",
                    editing: editMode,
                    product: product,
                    isAuthenticated: request.isLoggedIn
                });
            })
            .catch(err => {
                console.log(err);
            });
};


exports.postEditProduct = (request, response, next) => {
    const prodId = request.body.productId;
    const updatedTitle = request.body.title;
    const updatedPrice = request.body.price;
    const updatedDesc = request.body.description;
    const updatedImageUrl = request.body.imageUrl;


    Product.findById(prodId)
            .then(product => {

                product.title = updatedTitle;
                product.price = updatedPrice;
                product.description = updatedDesc;
                product.imageUrl = updatedImageUrl;

                return product.save();

            })
            .then(result => {

                console.log("UPDATED PRODUCT!");

                response.redirect("/admin/products");
            })
            .catch(err => console.log(err));

};

exports.getProducts = (request, response, next) => {

    Product.find()
            // select() tells mongoose which field has to be retrieved
            // .select('title price -_id')
            // // populate() tells mongoose to populate a certain field
            // // with all details of information and not just an id
            // .populate("userId", "name")
            .then(products => {

                response.render("admin/products", {
                    prods: products,
                    pageTitle: "Admin Products",
                    path: "/admin/products",
                    isAuthenticated: request.isLoggedIn
                });
            })
            .catch(err => console.log(err));

};

exports.postDeleteProduct = (request, response, next) => {

    const prodId = request.body.productId;

    // this findByIdAndRemove() is static method coming from mongoose
    Product.findByIdAndRemove(prodId)
            .then(result => {
                console.log(`DELETED PRODUCT WITH ID ${prodId}`);

                response.redirect("/admin/products");
            })
            .catch(err => console.log(err));

};

















