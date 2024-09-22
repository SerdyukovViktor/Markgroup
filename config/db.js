const mongoose = require('../Back/node_modules/mongoose');

const dbName = 'BitcoinHistory';

mongoose.connect(`mongodb://localhost:27017/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = { mongoose, dbName };