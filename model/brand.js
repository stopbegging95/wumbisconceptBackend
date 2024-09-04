const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter the brand name!"],
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    categoryId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand', // Reference to the Brand model
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Brand", brandSchema);
