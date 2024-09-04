const express = require("express");
const { isAdmin, isSeller, isAuthenticated } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const router = express.Router();
const Category = require("../model/category");
const ErrorHandler = require("../utils/ErrorHandler");

// Create category
router.post(
    "/create-category",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { name, description, brands } = req.body;
            const category = await Category.create({ name, description, brands });
            const populatedCategory = await category.populate("brands").execPopulate();
            res.status(201).json({
                success: true,
                category: populatedCategory,
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

// Get all categories
router.get(
    "/get-all-categories",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const categories = await Category.find().populate('brands');
            res.status(200).json({
                success: true,
                categories,
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

// Update category
router.put(
    "/update-category/:id",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { id } = req.params;
            const { name, description, brands } = req.body;
            const category = await Category.findByIdAndUpdate(id, { name, description, brands }, { new: true, runValidators: true }).populate("brands");
            res.status(200).json({
                success: true,
                category,
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

// Delete category
router.delete(
    "/delete-category/:id",
    catchAsyncErrors(async (req, res, next) => {
        try {
            await Category.findByIdAndDelete(req.params.id);
            res.status(200).json({
                success: true,
                message: "Category deleted successfully!",
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

module.exports = router;
