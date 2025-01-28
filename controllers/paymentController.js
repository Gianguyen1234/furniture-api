require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paypal = require('@paypal/checkout-server-sdk');
const Order = require('../models/Order');

// Process Stripe payment
exports.processPayment = async (req, res) => {
    const { orderId, paymentMethodId } = req.body;
  
    try {
      // Fetch the order
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      // Create Stripe PaymentIntent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(order.totalPrice * 100), // Convert to cents
        currency: 'usd',
        payment_method: paymentMethodId,
        confirm: true, // Automatically confirm the payment
        automatic_payment_methods: {
          enabled: true, // Enables automatic handling of payment methods
          allow_redirects: 'never', // Prevents redirect-based payment methods
        },
      });
  
      // Update order payment details
      order.isPaid = true;
      order.paidAt = new Date();
      order.paymentResult = {
        id: paymentIntent.id,
        status: paymentIntent.status,
        update_time: new Date().toISOString(),
        email_address: paymentIntent.receipt_email || 'N/A',
      };
  
      await order.save();
  
      res.status(200).json({
        message: 'Payment successful',
        order,
      });
    } catch (error) {
      console.error('Payment Error:', error.message); // Log error for debugging
      res.status(500).json({
        message: 'Payment failed',
        error: error.message,
      });
    }
};


// Configure PayPal environment
const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_SECRET
);
const client = new paypal.core.PayPalHttpClient(environment);

exports.createPayPalOrder = async (req, res) => {
  const { totalPrice } = req.body;

  try {
      const request = new paypal.orders.OrdersCreateRequest();
      request.requestBody({
          intent: "CAPTURE",
          purchase_units: [
              {
                  amount: {
                      currency_code: "USD",
                      value: totalPrice.toFixed(2),
                  },
              },
          ],
      });

      const order = await client.execute(request);

      res.status(201).json({
          orderId: order.result.id,
          approveUrl: order.result.links.find(link => link.rel === "approve").href,
      });
  } catch (error) {
      console.error("PayPal Create Order Error:", error.message);
      res.status(500).json({ message: "Failed to create PayPal order", error: error.message });
  }
};

exports.processPayPalPayment = async (req, res) => {
  const { orderId, orderCaptureId } = req.body;

  try {
      // Capture the payment
      const request = new paypal.orders.OrdersCaptureRequest(orderCaptureId);
      request.requestBody({});
      const capture = await client.execute(request);

      if (capture.result.status !== "COMPLETED") {
          return res.status(400).json({ message: "Payment not completed" });
      }

      // Update the order with payment details
      const order = await Order.findById(orderId);
      if (!order) {
          return res.status(404).json({ message: "Order not found" });
      }

      order.isPaid = true;
      order.paidAt = new Date();
      order.paymentResult = {
          id: capture.result.id,
          status: capture.result.status,
          update_time: capture.result.update_time,
          email_address: capture.result.payer.email_address,
      };
      order.paymentMethod = "PayPal";

      await order.save();

      res.status(200).json({
          message: "Payment successful",
          order,
      });
  } catch (error) {
      console.error("PayPal Payment Error:", error);
      res.status(500).json({
          message: "Failed to capture PayPal payment",
          error: error.message,
      });
  }
};
