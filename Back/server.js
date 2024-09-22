// server.js
const express = require('express')
const axios = require('axios')
const dbConfig = require('../config/db');
const mongoose = dbConfig.mongoose;
const dbName = dbConfig.dbName;

const app = express()
const port = 3001

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))

db.once('open', function() {
  console.log('Connected to MongoDB')
})

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
})

app.get('/api/prices', async (req, res) => {
  const period = req.query.period || '1d';
  const db = mongoose.connection;
  let prices;
  switch (period) {
    case 'day':
      prices = await db.collection('prices').find({ timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }).toArray();
      break;
    case 'week':
      prices = await db.collection('prices').find({ timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }).toArray();
      break;
    case 'month':
      prices = await db.collection('prices').find({ timestamp: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }).toArray();
      break;
    case 'year':
      prices = await db.collection('prices').find({ timestamp: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) } }).toArray();
      break;
    default:
      prices = await db.collection('prices').find().toArray();
  }

  res.json(prices);
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})