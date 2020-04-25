//require the library
const mongoose = require('mongoose');
//for production
const env = require('./environment')
//connect to the database
mongoose.connect(`mongodb://localhost/${env.db}`);

//acquire the connection(to check if it's successful)
const db = mongoose.connection;

//error
db.on('error',console.error.bind(console,"Error connecting to database"));

//up and running then print the message
db.once('open', function() {
  
    console.log("Successfully connected to the database");

});

module.exports=db;