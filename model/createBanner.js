const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your banner name!"],
    },
    title: {
        type: String,
        required: [true, "Please enter your banner description!"],
    },
    subtitle: {
        type: String,
        // required: [true, "Please enter your banner description!"],
    },
    littleText: {
        type: String,
        // required: [true, "Please enter your banner description!"],
    },
    tags: {
        type: String,
        required: [true, "Please select your banner tag!"],
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

module.exports = mongoose.model("Banner", bannerSchema);
