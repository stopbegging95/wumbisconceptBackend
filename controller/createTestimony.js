const express = require("express");
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const router = express.Router();
const Testimony = require("../model/createTestimony");
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/ErrorHandler");

// Create Testimony
router.post(
    "/create-testimony",
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
                    folder: "testimonys",
                });

                imagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            }

            const testimonyData = req.body;
            testimonyData.images = imagesLinks;

            const testimony = await Testimony.create(testimonyData);

            res.status(201).json({
                success: true,
                testimony,
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

// Get all testimony
router.get(
    "/get-all-testimonys",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const testimonys = await Testimony.find();

            res.status(200).json({
                success: true,
                testimonys,
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

// Delete Testimony
router.delete(
    "/delete-testimony/:id",
    isAuthenticated,
    isAdmin("Admin"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const testimony = await Testimony.findById(req.params.id);

            if (!testimony) {
                return next(new ErrorHandler("Testimony not found with this id", 404));
            }

            for (let i = 0; i < testimony.images.length; i++) {
                await cloudinary.v2.uploader.destroy(testimony.images[i].public_id);
            }

            await testimony.deleteOne();

            res.status(200).json({
                success: true,
                message: "Testimony deleted successfully!",
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

// Get all Testimony (admin)
router.get(
    "/admin-all-testimonys",
    isAuthenticated,
    isAdmin("Admin"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const testimonys = await Testimony.find().sort({
                createdAt: -1,
            });
            res.status(200).json({
                success: true,
                testimonys,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

module.exports = router;