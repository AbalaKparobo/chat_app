const mongoose = require('mongoose');

// use an async fuction and carry out all db validation here

const db = mongoose.connect("mongodb://localhost:27017/chat_app", {useNewUrlParser: true, useUnifiedTopology: true});
// Test refused connection server
// const db = mongoose.connect("mongodb://172.25.20.140:27017", {useNewUrlParser: true, useUnifiedTopology: true});

module.exports = db;