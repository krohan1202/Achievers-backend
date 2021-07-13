require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const path = require('path');
const shortid = require('shortid');
const Razorpay = require('razorpay');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(fileUpload({
    useTempFiles: true
}))

// Routes
app.use("/api", require("./routes/newsletter"));
app.use('/user', require('./routes/userRouter'));
app.use('/api', require('./routes/categoryRouter'));
app.use('/api', require('./routes/upload'));
app.use('/api', require('./routes/productRouter'));
app.use('/api', require('./routes/paymentRouter'));


// Connect to mongodb
const URI = process.env.MONGODB_URL
mongoose.connect(URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err =>{
    if(err) throw err;
    console.log('Connected to MongoDB')
})

// Razorpay Integration
const KEY_ID = process.env.PAYMENT_KEY_ID;
const KEY_SECRET = process.env.PAYMENT_KEY_SECRET;

const razorpay = new Razorpay({
	key_id: KEY_ID,
	key_secret: KEY_SECRET
})

// app.get('/logo.svg', (req, res) => {
// 	res.sendFile(path.join(__dirname, 'logo.svg'))
// })

app.post('/verification', (req, res) => {
	// do a validation
	const secret = process.env.RAZ_VALIDATION_SECRET
	// console.log(req.body)

	const crypto = require('crypto')

	const shasum = crypto.createHmac('sha256', secret)
	shasum.update(JSON.stringify(req.body))
	const digest = shasum.digest('hex')

	console.log(digest, req.headers['x-razorpay-signature'])

	if (digest === req.headers['x-razorpay-signature']) {
		console.log('request is legit')
		// process it
		require('fs')
	} else {
		// pass it
	}
	res.json({ status: 'ok' })
});

app.post("/sendTotal", (req, res) => {
	console.log(req.body);
	var total = req.body.total;
	console.log(total);

	app.post('/razorpay', async (req, res) => {
		const payment_capture = 1
		const amount = total
		const currency = 'INR'
	
		const options = {
			amount: (amount * 100),
			currency,
			receipt: shortid.generate(),
			payment_capture
		}
		
		try {
			const response = await razorpay.orders.create(options)
			console.log(response)
			res.json({
				id: response.id,
				currency: response.currency,
				amount: response.amount
			})
		} catch (error) {
			console.log(error)
		}
	})
})

// app.post('/razorpay', async (req, res) => {
// 	const payment_capture = 1
// 	const amount = 60
// 	const currency = 'INR'

// 	const options = {
// 		amount: (amount * 100),
// 		currency,
// 		receipt: shortid.generate(),
// 		payment_capture
// 	}
	
// 	try {
// 		const response = await razorpay.orders.create(options)
// 		console.log(response)
// 		res.json({
// 			id: response.id,
// 			currency: response.currency,
// 			amount: response.amount
// 		})
// 	} catch (error) {
// 		console.log(error)
// 	}
// })

app.get('/',(req,res) => {
	return res.send('Route Working.');
});

const PORT = process.env.PORT || 5000
app.listen(PORT, () =>{
    console.log('Server is running on port', PORT);
})