const Payments = require('../models/paymentModel');
const Users = require('../models/userModel');
const Products = require('../models/productModel');


const paymentCtrl = {
    getPayments: async(req, res) =>{
        try {
            const payments = await Payments.find()
            res.json(payments)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    createPayment: async(req, res) => {
        try {
            // console.log(res);
            // console.log(req.body);
            // console.log(req.headers);
            const {email, cart, razPayId} = req.body;
            
            var request = require('request');
            const fetchPayment = "https://" + process.env.PAYMENT_KEY_ID + ":" + process.env.PAYMENT_KEY_SECRET + "@api.razorpay.com/v1/payments/" + razPayId;
            request(fetchPayment, async function (error, response, body) {
                console.log('Response:', body);
                body = JSON.parse(body);
                console.log(body)

                const user = await Users.findOne({email})
                
                if(!user) return res.status(400).json({msg: "User does not exist!!"})

                const {_id, name} = user;
                
                const newPayment = new Payments({
                    user_id: _id, name, email, phone: body.contact, razPayId, cart
                })

                await newPayment.save((err, newPayment) => {
                    if (err) {
                        console.log(err)
                    return res.status(400).json({
                        error: "Failed to save order in DB.",
                    });
                    }
                    res.json({msg: "Payment Success!"})
                    console.log(newPayment)
                });
            });
 
        }
        catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

const sold = async (id, quantity, oldSold) =>{
    await Products.findOneAndUpdate({_id: id}, {
        sold: quantity + oldSold
    })
}

module.exports = paymentCtrl;
