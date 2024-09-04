const express = require("express");
const router = express.Router();
const Brand = require("../model/brand");
const { isAdmin, isAuthenticated } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Create brand
router.post(
    "/create-brand",
    // isAuthenticated,
    // isAdmin,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { name, description } = req.body;
            const brand = await Brand.create({ name, description });
            res.status(201).json({
                success: true,
                brand,
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

//get brand by category  
router.get('/brands/:categoryId', async (req, res) => {
    try {
        const { categoryId } = req.params;
        const brands = await Brand.find({ categoryId });
        res.status(200).json({ success: true, brands });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Get all brands
router.get(
    "/get-all-brands",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const brands = await Brand.find();
            res.status(200).json({
                success: true,
                brands,
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

// Update brand
router.put(
    "/update-brand/:id",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { id } = req.params;
            const { name, description } = req.body;
            const brand = await Brand.findByIdAndUpdate(id, { name, description }, { new: true, runValidators: true });
            res.status(200).json({
                success: true,
                brand,
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

// Delete brand
router.delete(
    "/delete-brand/:id",
    // isAuthenticated,
    // isAdmin,
    catchAsyncErrors(async (req, res, next) => {
        try {
            await Brand.findByIdAndDelete(req.params.id);
            res.status(200).json({
                success: true,
                message: "Brand deleted successfully!",
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

module.exports = router;
