// const express = require('express');
// const cloudinary = require("cloudinary"); // Import the sendMail function
// const bodyParser = require('body-parser');

// const ErrorHandler = require("../utils/ErrorHandler");
// const catchAsyncErrors = require("../middleware/catchAsyncErrors");
// const router = express.Router();

// const app = express();
// app.use(bodyParser.json());  // To parse JSON bodies

// route.post("/contact", catchAsyncErrors(async (req, res) => {
//     const { firstName, lastName, email, phone, subject, message } = req.body;

//     try {
//         await sendMail({
//             email: process.env.SMPT_MAIL,  // Send the email to your specified address
//             subject: `Contact Form Submission: ${subject}`,
//             message: `You have a new contact form submission from ${firstName} ${lastName}.\n\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`,
//         });
//         res.status(200).json({ success: true, message: 'Email sent successfully' });
//     } catch (error) {
//         console.error('Error sending email:', error);
//         res.status(500).json({ success: false, message: 'Failed to send email' });
//     }
// }));




