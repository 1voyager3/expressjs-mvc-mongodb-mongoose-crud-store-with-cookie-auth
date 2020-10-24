const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const errorsController = require("./controllers/errors");
const mongoose = require("mongoose");

const User = require("./models/user");

const app = express();

// set() is a method for a global configuration value
// details https://expressjs.com/en/4x/api.html#app.set
app.set("view engine", "ejs");
// path where to find this templates, second argument is our directory
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes  = require("./routes/shop");
const authRoutes  = require("./routes/auth");

// to be able parse request body
//request.body
app.use(bodyParser.urlencoded({ extended: false }));

app.use((request, response, next) => {
    User.findById("5f908fe944ebc5142114f4df")
            .then((user) => {
                request.user = user;

                // call the next() to continue with the next step if we get our user in the store
                next();
            })
            .catch((err) => console.log(err));
});

// to serve files statically it means not handled by the express router
// or other middleware but instead directly forwarder to the file system
// for this we use static() which serves static files through the new middleware app.use()
app.use(express.static(path.join(__dirname, "public")));

// the same as http://localhost:3000/admin
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// we don't use path because it by default
app.use(errorsController.get404);

mongoose
        .connect(
                //put appropriate mongodb url
                ""
        )
        .then((result) => {

            User.findOne()
                    .then(user => {
                        if (!user) {

                            const user = new User({
                                name: "Voyager",
                                email: "voyager@test.com",
                                cart: {
                                    items: []
                                }
                            });

                            user.save();
                        }
                    });

            console.log("Connected to MONGOOSE!");

            app.listen(3000);
        })
        .catch((err) => {
            console.log(err);
        });
