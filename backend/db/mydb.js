const mongoose = require('mongoose')
require('dotenv').config();

const uri = process.env.MONGODB_URI;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})

const connection = mongoose.connection;
connection.once('open',() => {
    console.log("MongoDB connection establised successfully");
})
