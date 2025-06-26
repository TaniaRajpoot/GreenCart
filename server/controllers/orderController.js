import Order from "../models/Order.js";
import Product from "../models/product.js";
import stripe from "stripe"
import User from "../models/User.js"

//Place Order COD: /api/order/cod
export const placeOrderCOD = async (req,res)=>{
    try {
        const {userId, items,address} = req.body;
        if(!address || items.length === 0){
            res.json({success:false, message:'Invalid Data'})
        }

        //Calculate Amount Using items
        let amount = await items.reduce(async(acc, item)=>{
            const product = await Product.findById(item.product);
            return (await acc) + product.price * item.quantity;

        },0)

        //Add Tax Charge (2%)
        amount += Math.floor(amount * 0.02);

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD",
        })

       res.json({success:true, message:'Order Placed Successfully '})
    } catch (error) {
        res.json({success:false, message:error.message })
    }
}


//Place Order Stripe: /api/order/stripe
export const placeOrderStripe = async (req,res)=>{
    try {
        const {userId, items,address} = req.body;
        const {origin}= req.headers;
        if(!address || items.length === 0){
            res.json({success:false, message:'Invalid Data'})
        }

        let productData = []

        //Calculate Amount Using items
        let amount = await items.reduce(async(acc, item)=>{
            const product = await Product.findById(item.product);
            productData.push({
                name:product.name,
                price:product.price,
                quantity:item.quantity,
            });
            return (await acc) + product.price * item.quantity;

        },0)

        //Add Tax Charge (2%)
        amount += Math.floor(amount * 0.02);

        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Online",
        })

        //stripe gateway initialize
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

        //create line items for stripe
        const line_items = productData.map((item)=>{
            return{
                price_data: {
                    currency:"usd",
                    product_data:{
                        name:item.name,
                    },
                    unit_amount:Math.floor(item.price+ item.price * 0.2) * 100 

                },
                quantity:item.quantity,
            }
        })

        //create session 
        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode:"payment",
            success_url:`${origin}/loader?next=my-orders`,
            cancel_url:`${origin}/cart`,
            metadata:{
                orderId: order.id.toString(),
                userId,
            }
        })

       res.json({success:true, url:session.url});
    } catch (error) {
        res.json({success:false, message:error.message })
    }
}

//Stripe Webhook to verify payment action : /stripe
export const stripeWebHooks = async (req,res)=>{
    //stripe gateway initialize
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
   
    const sig = requestAnimationFrame.headers["stripe-signature"];
    let  event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            requestAnimationFrame.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        Response.status(400).send(`Webhook Error: ${error.message}`)
        
    }

    // handle event 
    switch (event.type) {
        case "payment_intent.succeeded":{
            const paymentIntent = event.daa.object;
            const paymentIntentId = paymentIntent.id;

            //getting session meta data 
            const session = await stripeInstance.checkout.session.list({
                paymentIntent: paymentIntentId,

            });

            const {orderId, userId} = session.data[0].metadata;
             // mark payment as paid 
             await Order.findByIdAndUpdate(orderId),{isPaid:true}
             //clear user cart 
             await User.findByIdAndUpdate(userId, {cartItem: {}});
             break;
        }

        case "payment_intent.payment_filled":{
            const paymentIntent = event.daa.object;
            const paymentIntentId = paymentIntent.id;

            //getting session meta data 
            const session = await stripeInstance.checkout.session.list({
                paymentIntent: paymentIntentId,

            });

            const {orderId} = session.data[0].metadata;
            await Order.findByIdAndDelete(orderId);
            break;
        
        }
            
    
        default:
            console.error(`Unhandled event type ${event.type}`)
            break;
    }
    response.json({})
}

//Get orders by user id : /api/order/user

export const getUserOrders = async (req,res)=>{
    try {
        const userId = req.userId;
        const orders = await Order.find({
            userId,
            $or:[{paymentType: "COD"}, {isPaid:true}]
        }).populate("items.product address").sort({createdAt: -1})

        res.json({success:true, orders})
    } catch (error) {
        res.json({success:false, message:error.message })
    }
}

//Get All Orders (for seller /admin ) : api/user/seller

export const getAllOrders = async (req,res)=>{
    try {
        const orders = await Order.find({
           $or:[{paymentType: "COD"}, {isPaid:true}]
        }).populate("items.product address").sort({createdAt: -1})
        res.json({success:true, orders})
    } catch (error) {
        res.json({success:false, message:error.message })
    }
}