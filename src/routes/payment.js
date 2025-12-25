const express = require("express");
const paymentRouter = express.Router();
const razorPayInstance = require("../utils/razorpay");
const { userAuth } = require("../middlewares/auth");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    // this is the code to create order on razorPay
    const order = await razorPayInstance.orders.create({
      amount: 50000, //this value is in lower denomination of currency(this is in paisa)
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName: "value3",
        lastName: "value2",
        memberShip: "silver",
      },
    }); //this will return a promise and we will create an order

    // Save it in my database
    console.log(order);

    // return back my order details to frontend
    res.json({ data: order });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = paymentRouter;
