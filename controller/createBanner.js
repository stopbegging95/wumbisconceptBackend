const express = require("express");
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const router = express.Router();
const Banner = require("../model/createBanner");
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/ErrorHandler");

// Create banner
router.post(
    "/create-banner",
    catchAsyncErrors(async (req, res, next) => {
        try {
            let images = [];

            if (typeof req.body.images === "string") {
                images.push(req.body.images);
            } else {
                images = req.body.images;
            }

            const imagesLinks = [];

            for (let i = 0; i < images.length; i++) {
                const result = await cloudinary.v2.uploader.upload(images[i], {
                    folder: "banners",
                });

                imagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            }

            const bannerData = req.body;
            bannerData.images = imagesLinks;

            const banner = await Banner.create(bannerData);

            res.status(201).json({
                success: true,
                banner,
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

// Get all banners
router.get(
    "/get-all-banners",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const banners = await Banner.find();

            res.status(200).json({
                success: true,
                banners,
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

// Delete banner
router.delete(
    "/delete-banner/:id",
    isAuthenticated,
    isAdmin("Admin"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const banner = await Banner.findById(req.params.id);

            if (!banner) {
                return next(new ErrorHandler("Banner not found with this id", 404));
            }

            for (let i = 0; i < banner.images.length; i++) {
                await cloudinary.v2.uploader.destroy(banner.images[i].public_id);
            }

            await banner.deleteOne();

            res.status(200).json({
                success: true,
                message: "Banner deleted successfully!",
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

// Get all banners (admin)
router.get(
    "/admin-all-banners",
    isAuthenticated,
    isAdmin("Admin"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const banners = await Banner.find().sort({
                createdAt: -1,
            });
            res.status(200).json({
                success: true,
                banners,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

module.exports = router;