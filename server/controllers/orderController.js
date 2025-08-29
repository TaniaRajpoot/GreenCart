import Order from "../models/Order.js";
import Product from "../models/product.js";
import stripe from "stripe";
import User from "../models/User.js";

// Place Order COD: /api/order/cod
export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    console.log(req.body);

    if (!address || !items || items.length === 0) {
      return res.json({ success: false, message: "Invalid Data" });
    }

    // Calculate total amount correctly with async reduce
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product)
        return res.json({ success: false, message: "Invalid Product" });
      amount += product.price * item.quantity;
    }

    amount += Math.floor(amount * 0.02); // 2% tax

    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
    });

    res.json({ success: true, message: "Order Placed Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Place Order Stripe: /api/order/stripe
export const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    const { origin } = req.headers;

    if (!address || !items || items.length === 0) {
      return res.json({ success: false, message: "Invalid Data" });
    }

    const productData = [];
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product)
        return res.json({ success: false, message: "Invalid Product" });
      productData.push({
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });
      amount += product.price * item.quantity;
    }

    amount += Math.floor(amount * 0.02); // 2% tax

    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Online",
    });

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    const line_items = productData.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        // Your pricing logic (including tax) - must be integer cents
        unit_amount: Math.floor((item.price + item.price * 0.2) * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId,
      },
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Stripe Webhook: /stripe
export const stripeWebHooks = async (req, res) => {
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const { orderId, userId } = session.metadata;

        console.log(
          `Stripe Checkout completed for orderId: ${orderId}, userId: ${userId}`
        );

        await User.findByIdAndUpdate(userId, { cartItem: {} });

        console.log("Order marked as paid and user cart cleared");
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object;
        const { orderId } = session.metadata;

        console.log(`Stripe Checkout session expired for orderId: ${orderId}`);
        await Order.findByIdAndDelete(orderId);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error("Error processing webhook event:", error);
    return res.status(500).send("Internal Server Error");
  }

  res.json({ received: true });
};

// Get orders by user id: /api/order/user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await Order.find({
      userId,
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get all orders (admin/seller): /api/order/seller
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("items.product address")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
