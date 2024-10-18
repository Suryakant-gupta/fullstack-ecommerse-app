
import orderModel from '../models/orderModel.js'
import userModel from '../models/userModel.js';
import Stripe from 'stripe'
import razorpay from 'razorpay'


// Global varibles
const currency = 'usd'
const rcurrency = 'INR'
const deliveryCharge  = 10


// gateway Initialize
const stripe = new Stripe(process.env.STRIPE_SECRET);
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET
})



// place cod order function

const placeOrder = async(req, res)=>{

    try {

        const {userId, address, amount, items}  = req.body;
        const orderData = {
            userId, items, amount, address,
            paymentMethod : "COD",
            payment : false,
            date : Date.now()
        }

        const newOrder = new orderModel(orderData);

        await newOrder.save();
        
        await userModel.findByIdAndUpdate(userId, {cartData: {}});

        res.json({success : true, message : "Order Placed"});

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
        
    }

}

// place  order using Stripe function

const placeOrderStripe = async(req, res)=>{
    try {
        
        const {userId, address, amount, items}  = req.body;
        const {origin} = req.headers;

        const orderData = {
            userId, items, amount, address,
            paymentMethod : "Stripe",
            payment : false,
            date : Date.now()
        }

        const newOrder = new orderModel(orderData);

        await newOrder.save();

        const line_items = items.map((item)=>({
            price_data: {
                currency : currency,
                product_data: {
                    name:item.name
                },
                unit_amount : item.price * 100
            } ,
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency : currency,
                product_data: {
                    name:'Delivery Charges'
                },
                unit_amount : deliveryCharge * 100
            } ,
            quantity: 1
        });

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode : 'payment',
        })

        res.json({success: true, session_url: session.url});

    } catch (error) {
        console.log(error);
        res.json({success:false , message:error.message})
            
    }
}


// verify stripe payment

const verifyStripe = async (req, res)=>{
    const {orderId, success, userId, setCartItem} = req.body;

    try {
        if (success === 'true') {
            await orderModel.findByIdAndUpdate(orderId, {payment:true});
            await userModel.findByIdAndUpdate(userId, {cartData: {}});

            res.json({success: true})
        }else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success: false})
        }
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
        
    }
}



// place  order using Razorpay function

const placeOrderRazorpay = async(req, res)=>{

    try {
        const {userId, address, amount, items}  = req.body;
    
    const orderData = {
        userId, items, amount, address,
        paymentMethod : "Razorpay",
        payment : false,
        date : Date.now()
    }

    const newOrder = new orderModel(orderData);

    await newOrder.save();

    const options = {
        amount: amount * 100,
        currency: rcurrency,
        receipt: newOrder._id.toString()
    }

    await razorpayInstance.orders.create(options, (error, order)=>{
        if (error) {
            console.log(error);
            return res.json({success: false, message: error.message})
        }

        res.json({success: true, order})
    })
    } catch (error) {
        console.log(error);
        return res.json({success: false, message: error.message})
        
    }

}


// verify Razorpay

const verifyRazorpay = async()=>{
    try {
        const {userId, razorpay_order_id} = req.body;

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
        if (orderInfo.status === 'paid') {
            await orderModel.findByIdAndUpdate(orderInfo.receipt, {payment: true});

            await userModel.findByIdAndUpdate(userId, {cartData: {}})

            res.json({success: true, message:'Payment Successful'})
        }else{
            res.json({success: false, message:'Payment Failed'})
        }
        
    } catch (error) {
        console.log(error);
        return res.json({success: false, message: error.message});
    }
}


// Get all orders data for admin panel


const allOrders = async (req, res)=>{
try {
    const orders = await orderModel.find();
    res.json({success: true, orders})
} catch (error) {
    console.log(error);
        res.json({success: false, message: error.message})
}
    
}


// user order data for frontend


const userOrders = async (req, res)=>{

    try {
        
        const {userId} = req.body;

        const orders = await orderModel.find({userId});
        res.json({success: true, orders})

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
        
    }
    
}


// Update order status from admin panel 

const updateStatus = async (req, res)=>{
    try {
        const {orderId, status}  = req.body;

        await orderModel.findByIdAndUpdate(orderId, {status});
        res.json({success: true , message: 'Status updated'})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
        
    }
}


export {placeOrder, placeOrderRazorpay, placeOrderStripe, updateStatus, userOrders, allOrders, verifyStripe, verifyRazorpay};