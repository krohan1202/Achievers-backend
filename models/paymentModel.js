const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const paymentSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    updated: Date,
    user: {
      type: ObjectId,
      ref: "Users",
    },
    razPayId:{
        type: String,
        required: true
    },
    cart:{
        type: Array,
        default: []
    }
    // status:{
    //     type: Boolean,
    //     default: false
    // }
}, {
    timestamps: true
})


module.exports = mongoose.model("Payments", paymentSchema);