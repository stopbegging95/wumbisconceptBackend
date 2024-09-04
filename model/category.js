const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter the category name!"],
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    brands: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand', // Reference to the Brand model
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Category", categorySchema);
