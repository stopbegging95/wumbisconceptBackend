const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    cart: {
        type: Array,
        required: true,
    },
    shippingAddress: {
        type: Object,
        required: true,
    },
    user: {
        type: Object,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        default: "Your course registration has been confirmed, we will get back to you shortly",
    },
    size: {
        required: false,
        type: String,
    },
    color: {
        required: false,
        type: String,
    },
    paymentInfo: {
        id: {
            type: String,
        },
        status: {
            type: String,
        },
        type: {
            type: String,
        },
    },
    paidAt: {
        type: Date,
        default: Date.now(),
    },
    deliveredAt: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model("Order", orderSchema);


// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema({
//     cart: [
//         {
//             productId: {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: "Product", // Reference to the Product model
//                 required: true,
//             },
//             quantity: {
//                 type: Number,
//                 required: true,
//             },
//         },
//     ],
//     shippingAddress: {
//         type: Object,
//         required: true,
//     },
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User", // Reference to the User model
//         required: true,
//     },
//     totalPrice: {
//         type: Number,
//         required: true,
//     },
//     status: {
//         type: String,
//         default: "Your course registration has been confirmed, we will get back to you shortly",
//     },
//     paymentInfo: {
//         id: {
//             type: String,
//         },
//         status: {
//             type: String,
//         },
//         type: {
//             type: String,
//         },
//     },
//     paidAt: {
//         type: Date,
//         default: Date.now(),
//     },
//     deliveredAt: {
//         type: Date,
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now(),
//     },
// });

// module.exports = mongoose.model("Order", orderSchema);
