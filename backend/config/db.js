const mongoose = require('mongoose');

// connect to db 
const db = mongoose.connect("mongodb://localhost:27017/MERN-CHAt-APP").then(() => { }).catch((err) => { console.log(err) })

module.exports = db