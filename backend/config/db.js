const mongoose = require('mongoose');

// connect to db 
// const db = mongoose.connect("mongodb://localhost:27017/MERN-CHAt-APP").then(() => { }).catch((err) => { console.log(err) })
const db = mongoose.connect("mongodb+srv://mansigabani231:<rP5v!B8zUfteyr2>@mern-chat-app.rymtaoj.mongodb.net/?retryWrites=true&w=majority").then(() => { }).catch((err) => { console.log(err) })

module.exports = db