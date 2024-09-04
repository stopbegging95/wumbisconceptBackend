const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your product name!"],
  },
  description: {
    type: String,
    required: [true, "Please enter your product description!"],
  },
  modeoftutor: {
    type: String,
    required: [true, "Please enter your tutor method!"],
  },
  aboutthecourse: {
    type: String,
    required: [true, "Please type in about the course!"],
  },
  aimsandobjectives: {
    type: String,
    required: [true, "Please type in aim and objectives  the course!"],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Please enter your product category!"],
  },
  brands: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
    required: [true, "Please enter your product brand!"],
  },
  duration: {
    type: String,
    Required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  timezone: {
    type: String,
    default: "EST",
  },
  tags: {
    type: String,
    required: [true, "Please select your tag!"],
  },
  days: {
    type: String,
    required: [true, "Please select your start day!"],
  },
  enddays: {
    type: String,
    required: [true, "Please select your end day!"],
  },
  originalPrice: {
    type: Number,
  },

  images1: [
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

  images2: [
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

  images3: [
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

  reviews: [
    {
      user: {
        type: Object,
      },
      rating: {
        type: Number,
      },
      comment: {
        type: String,
      },
      productId: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now(),
      }
    },
  ],
  ratings: {
    type: Number,
  },
  shopId: {
    type: String,
    required: true,
  },
  shop: {
    type: Object,
    required: true,
  },
  sold_out: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Product", productSchema);
