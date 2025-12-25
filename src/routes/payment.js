const express = require("express");
const paymentRouter = express.Router();
const razorPayInstance = require("../utils/razorpay");
const { userAuth } = require("../middlewares/auth");
const Payment = require("../models/payment")
paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    // this is the code to create order on razorPay , we have initialized our razorpay instance with key 
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

    // console.log(order);
    // Save it in my database
    const payment = new Payment({
      userId: req.user._id,       //the userId will come from userAuth
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes
    })

    const savedPayment = await payment.save()

    // return back my order details to frontend
    res.json({ ...savedPayment.toJSON() });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = paymentRouter;
