const mongoose = require('mongoose');
const OrderSchema = mongoose.Schema({
  products: {
    type: Object
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    default: 'обробка'
  },
  total : {
    type: Number,
    default: 0.00
  },
  count: {
    type: Number,
    default: 0
  },
  date: {
    type: String,
    default: new Date().toISOString().split('T')[0]
  },
  address: {
    type: String,
  },
  country: {
    type: String,
  },
  city:{
    type: String,
  },
  post_index:{
    type: String,
  }

}, {minimize: false});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
