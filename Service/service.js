// service.js
const axios = require('axios');
// const mongoose = require('mongoose');
const dbConfig = require('../config/db');
const mongoose = dbConfig.mongoose;
const dbName = dbConfig.dbName;

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))

db.once('open', function() {
  console.log('Connected to MongoDB')
})

const priceSchema = new mongoose.Schema({
  timestamp: String,
  price: Number,
  currency: String
})

const Price = mongoose.model('Price', priceSchema)

const savePrice = async () => {
  try {
    const response = await axios.get('https://api.coindesk.com/v1/bpi/currentprice.json')
    const data = response.data
    const timestamp = new Date()

    for(const currency in data.bpi) {
    const price = data.bpi[currency].rate_float
    const newPrice = new Price({ timestamp, price, currency })
    await newPrice.save()
    console.log("Price saved");
    }
  } catch (error) {
    console.error(error)
  }
}
savePrice();
setInterval(savePrice, 60000)