const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated, isSeller, isAdmin } = require("../middleware/auth");
const Order = require("../model/order");
const Shop = require("../model/shop");
const Product = require("../model/product");
const sendMail = require("../utils/sendMail")


// create new order
router.post(
    "/create-order",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { cart, shippingAddress, user, totalPrice, paymentInfo, colors, sizes } = req.body;

            //   group cart items by shopId
            const shopItemsMap = new Map();

            for (const item of cart) {
                const shopId = item.shopId;
                if (!shopItemsMap.has(shopId)) {
                    shopItemsMap.set(shopId, []);
                }
                // Newly Added Code base goes here
                

                // Newly Added Code base ends here
                shopItemsMap.get(shopId).push(item);
            }

            // create an order for each shop
            const orders = [];

            for (const [shopId, items] of shopItemsMap) {
                const order = await Order.create({
                    cart: items,
                    shippingAddress,
                    user,
                    totalPrice,
                    paymentInfo,
                    colors,
                    sizes,
                });
                orders.push(order);
            }

            // Send email confirmation
            const emailContent = `
               
                <h1>Course Registration Confirmation</h1>
                <p>Dear  <strong> ${user.name}, </strong> </p>
                <p>Your course has been successfully registered with  Wumbis concept inc!</p>
                <p> <strong> With Email  </strong> </p> <p> ${user.email}  </p>
                <p> <strong> Mobile No: </strong> ${user.phoneNumber}  </p>
                <p><strong>Course Summary:</strong></p>
                <ul>
                        ${orders.map((order) =>
                            `
                                <li> <strong> Application ID:</strong> ${order._id}</li><br/> 
                                <li><strong>Total Price:</strong> $${order.totalPrice}</li> <br/>
                                <li><strong>Course Status:</strong> ${order.status}</li>
                            `
                         ).join("")}
                </ul>
                <p>Thank you for registering with us!</p>
       
            `;


            await sendMail({
                email: user.email,
                subject: "Course Registration Confirmation",
                message: emailContent,
            });

            res.status(201).json({
                success: true,
                orders,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// get all orders of user
router.get(
    "/get-all-orders/:userId",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const orders = await Order.find({ "user._id": req.params.userId }).populate("cart.productId", "name").sort({
                createdAt: -1,
            });

            res.status(200).json({
                success: true,
                orders,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// router.get(
//     "/get-all-orders/:userId",
//     catchAsyncErrors(async (req, res, next) => {
//         try {
//             const orders = await Order.find({ user: req.params.userId })
//                 .populate("user", "name email") // Populate the user's name and email
//                 .populate("cart.productId", "name") // Populate the product's name
//                 .sort({ createdAt: -1 });

//             res.status(200).json({
//                 success: true,
//                 orders,
//             });
//         } catch (error) {
//             return next(new ErrorHandler(error.message, 500));
//         }
//     })
// );

// get all orders of seller
router.get(
    "/get-seller-all-orders/:shopId",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const orders = await Order.find({
                "cart.shopId": req.params.shopId,
            }).sort({
                createdAt: -1,
            });

            res.status(200).json({
                success: true,
                orders,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);


// update order status for seller
router.put(
    "/update-order-status/:id",
    isSeller,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const order = await Order.findById(req.params.id);

            if (!order) {
                return next(new ErrorHandler("Order not found with this id", 400));
            }
            if (req.body.status === "Transferred to delivery partner") {
                order.cart.forEach(async (o) => {
                    await updateOrder(o._id, o.qty);
                });
            }

            order.status = req.body.status;

            if (req.body.status === "Delivered") {
                order.deliveredAt = Date.now();
                order.paymentInfo.status = "Succeeded";
                // const serviceCharge = order.totalPrice * .10;
                const serviceCharge = order.totalPrice * .0;
                await updateSellerInfo(order.totalPrice - serviceCharge);
            }

            await order.save({ validateBeforeSave: false });

            res.status(200).json({
                success: true,
                order,
            });

            async function updateOrder(id, qty) {
                const product = await Product.findById(id);

                product.stock -= qty;
                product.sold_out += qty;

                await product.save({ validateBeforeSave: false });
            }

            async function updateSellerInfo(amount) {
                const seller = await Shop.findById(req.seller.id);

                seller.availableBalance = amount;

                await seller.save();
            }
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// give a refund ----- user
router.put(
    "/order-refund/:id",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const order = await Order.findById(req.params.id);

            if (!order) {
                return next(new ErrorHandler("Order not found with this id", 400));
            }

            order.status = req.body.status;

            await order.save({ validateBeforeSave: false });

            res.status(200).json({
                success: true,
                order,
                message: "Order Refund Request successfully!",
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// accept the refund ---- seller
router.put(
    "/order-refund-success/:id",
    isSeller,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const order = await Order.findById(req.params.id);

            if (!order) {
                return next(new ErrorHandler("Order not found with this id", 400));
            }

            order.status = req.body.status;

            await order.save();

            res.status(200).json({
                success: true,
                message: "Order Refund successfull!",
            });

            if (req.body.status === "Refund Success") {
                order.cart.forEach(async (o) => {
                    await updateOrder(o._id, o.qty);
                });
            }

            async function updateOrder(id, qty) {
                const product = await Product.findById(id);

                product.stock += qty;
                product.sold_out -= qty;

                await product.save({ validateBeforeSave: false });
            }
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// all orders --- for admin
router.get(
    "/admin-all-orders",
    isAuthenticated,
    isAdmin("Admin"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const orders = await Order.find().sort({
                deliveredAt: -1,
                createdAt: -1,
            });
            res.status(201).json({
                success: true,
                orders,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);




module.exports = router;