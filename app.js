const express = require("express");
const ErrorHandler = require("./middleware/error");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path")
app.use(cors({
  origin: 'http://localhost:3000',
  //origin: ['wumbisdeployment.vercel.app',],
  methods: ["GET","POST","PUT","DELETE"], 
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use("/", express.static(path.join(__dirname, "./uploads")));
app.use("/test", (req, res) => {
  res.send("Hello world!");
});

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}

// import routes
const user = require("./controller/user");
const shop = require("./controller/shop");
const product = require("./controller/product");
const coupon = require("./controller/coupounCode");
const payment = require("./controller/payment");
const order = require("./controller/order");
// const message = require("./controller/message");
const banner = require("./controller/createBanner");
const testimony = require("./controller/createTestimony");
const category = require("./controller/category");
const brand = require("./controller/brand");

app.use("/api/v2/user", user);
// app.use("/api/v2/message", message);
app.use("/api/v2/order", order);
app.use("/api/v2/shop", shop);
app.use("/api/v2/product", product);
app.use("/api/v2/testimony", testimony);
app.use("/api/v2/banner", banner);
app.use("/api/v2/coupon", coupon);
app.use("/api/v2/payment", payment);
app.use("/api/v2/category", category);
app.use("/api/v2/brand", brand);


// it's for ErrorHandling
app.use(ErrorHandler);

module.exports = app;