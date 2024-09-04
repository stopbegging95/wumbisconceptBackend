const mongoose = require("mongoose");

const testimonySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your testimony name!"],
    },
    images: [
        {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model("Testimony", testimonySchema);
