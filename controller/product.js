const express = require("express");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const router = express.Router();
const Product = require("../model/product");
const Category = require("../model/category");
const Brand = require("../model/brand");
const Order = require("../model/order");
const Shop = require("../model/shop");
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/ErrorHandler");


// router.post(
//   "/create-product",
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       const shopId = req.body.shopId;
//       const shop = await Shop.findById(shopId);
//       if (!shop) {
//         return next(new ErrorHandler("Shop Id is invalid!", 400));
//       }

//       // Extract images from req.files (assuming you use multer or similar middleware)
//       const images1 = req.files.images1 || [];
//       const images2 = req.files.images2 || [];
//       const images3 = req.files.images3 || [];

//       const validateImageSize = (images) => {
//         return images.every(img => img.size <= 5 * 1024 * 1024); // 5MB limit
//       };

//       if (!validateImageSize([...images1, ...images2, ...images3])) {
//         return next(new ErrorHandler("One or more files exceed the 5MB size limit!", 400));
//       }

//       const imagesLinks1 = [];
//       const imagesLinks2 = [];
//       const imagesLinks3 = [];

//       for (const img of images1) {
//         const result = await cloudinary.v2.uploader.upload(img.path, {
//           folder: "products",
//         });
//         imagesLinks1.push({
//           public_id: result.public_id,
//           url: result.secure_url,
//         });
//       }

//       for (const img of images2) {
//         const result = await cloudinary.v2.uploader.upload(img.path, {
//           folder: "products",
//         });
//         imagesLinks2.push({
//           public_id: result.public_id,
//           url: result.secure_url,
//         });
//       }

//       for (const img of images3) {
//         const result = await cloudinary.v2.uploader.upload(img.path, {
//           folder: "products",
//         });
//         imagesLinks3.push({
//           public_id: result.public_id,
//           url: result.secure_url,
//         });
//       }

//       const productData = req.body;
//       productData.images1 = imagesLinks1;
//       productData.images2 = imagesLinks2;
//       productData.images3 = imagesLinks3;
//       productData.shop = shop;

//       // Save productData to your database (Product model)
//       const newProduct = await Product.create(productData);

//       res.status(201).json({
//         success: true,
//         product: newProduct,
//       });
//     } catch (error) {
//       next(new ErrorHandler(error.message, 500));
//     }
//   })
// );

router.post(
  "/create-product",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shopId = req.body.shopId;
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Shop Id is invalid!", 400));
      } else {
        let images1 = [];
        let images2 = [];
        let images3 = [];

        if (typeof req.body.images1 === "string") {
          images1.push(req.body.images1);
        } else {
          images1 = req.body.images1;
        }

        if (typeof req.body.images2 === "string") {
          images2.push(req.body.images2);
        } else {
          images2 = req.body.images2;
        }

        if (typeof req.body.images3 === "string") {
          images3.push(req.body.images3);
        } else {
          images3 = req.body.images3;
        }

        const imagesLinks1 = [];
        const imagesLinks2 = [];
        const imagesLinks3 = [];

        for (let i = 0; i < images1.length; i++) {
          const result = await cloudinary.v2.uploader.upload(images1[i], {
            folder: "products",
          });
          imagesLinks1.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }

        for (let i = 0; i < images2.length; i++) {
          const result = await cloudinary.v2.uploader.upload(images2[i], {
            folder: "products",
          });
          imagesLinks2.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }

        for (let i = 0; i < images3.length; i++) {
          const result = await cloudinary.v2.uploader.upload(images3[i], {
            folder: "products",
          });
          imagesLinks3.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }

        let productData = req.body;
        productData.images1 = imagesLinks1;
        productData.images2 = imagesLinks2;
        productData.images3 = imagesLinks3;

        productData.shop = shop;

        const product = await Product.create(productData);

        res.status(201).json({
          success: true,
          product,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);


// Edit product
router.put(
  "/update-product/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;

      // Check and upload new images if provided
      if (req.body.images1) {
        let images1 = [];
        if (typeof req.body.images1 === "string") {
          images1.push(req.body.images1);
        } else {
          images1 = req.body.images1;
        }

        const imagesLinks1 = [];
        for (let i = 0; i < images1.length; i++) {
          const result = await cloudinary.v2.uploader.upload(images1[i], {
            folder: "products",
          });
          imagesLinks1.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }
        updatedData.images1 = imagesLinks1;
      }

      // for images 2
      if (req.body.images2) {
        let images2 = [];
        if (typeof req.body.images2 === "string") {
          images2.push(req.body.images2);
        } else {
          images2 = req.body.images2;
        }

        const imagesLinks2 = [];
        for (let i = 0; i < images2.length; i++) {
          const result = await cloudinary.v2.uploader.upload(images2[i], {
            folder: "products",
          });
          imagesLinks2.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }
        updatedData.images2 = imagesLinks2;
      }

      // for image 3
      if (req.body.images3) {
        let images3 = [];
        if (typeof req.body.images3 === "string") {
          images3.push(req.body.images3);
        } else {
          images3 = req.body.images3;
        }

        const imagesLinks3 = [];
        for (let i = 0; i < images3.length; i++) {
          const result = await cloudinary.v2.uploader.upload(images3[i], {
            folder: "products",
          });
          imagesLinks3.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }
        updatedData.images3 = imagesLinks3;
      }

      // Update the product in the database
      const product = await Product.findByIdAndUpdate(id, updatedData, {
        new: true,
        runValidators: true,
      });

      res.status(200).json({
        success: true,
        product,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);


// get all products of a shop
router.get(
  "/get-all-products-shop/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find({ shopId: req.params.id });

      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// delete product of a shop
router.delete(
  "/delete-shop-product/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return next(new ErrorHandler("Product is not found with this id", 404));
      }

      // for (let i = 0; 1 < product.images.length; i++) {
      //   const result = await cloudinary.v2.uploader.destroy(
      //     product.images[i].public_id
      //   );
      // }

      for (let i = 0; 1 < product.images1.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(
          product.images1[i].public_id
        );
      }

      for (let i = 0; 1 < product.images2.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(
          product.image2[i].public_id
        );
      }

      for (let i = 0; 1 < product.images3.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(
          product.image3[i].public_id
        );
      }

      await product.deleteOne();
      res.status(201).json({
        success: true,
        message: "Product Deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);


// get all products
router.get(
  "/get-all-products",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });
      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

router.get(
  "/get-products-by-brand/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find({ brands: req.params.id });
      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// review for a product
router.put(
  "/create-new-review",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { user, rating, comment, productId, orderId } = req.body;
      const product = await Product.findById(productId);
      const review = {
        user,
        rating,
        comment,
        productId,
      };
      const isReviewed = product.reviews.find(
        (rev) => rev.user._id === req.user._id
      );

      if (isReviewed) {
        product.reviews.forEach((rev) => {
          if (rev.user._id === req.user._id) {
            (rev.rating = rating), (rev.comment = comment), (rev.user = user);
          }
        });
      } else {
        product.reviews.push(review);
      }

      let avg = 0;
      product.reviews.forEach((rev) => {
        avg += rev.rating;
      });
      product.ratings = avg / product.reviews.length;
      await product.save({ validateBeforeSave: false });
      await Order.findByIdAndUpdate(
        orderId,
        { $set: { "cart.$[elem].isReviewed": true } },
        { arrayFilters: [{ "elem._id": productId }], new: true }
      );
      res.status(200).json({
        success: true,
        message: "Reviwed succesfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// all products --- by admin
router.get(
  "/admin-all-products",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
