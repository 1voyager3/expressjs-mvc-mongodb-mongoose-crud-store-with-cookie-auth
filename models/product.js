const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        // it refers to user model in our app
        ref: "User",
        required: true
    }
});

// mode() is a mongoose method to connect schema (blueprint) with a name 'Product'
// mongoose takes the 'Product' name makes it to lowercase and put it into plural
// to create collection which is going to be 'products'
module.exports = mongoose.model("Product", productSchema);