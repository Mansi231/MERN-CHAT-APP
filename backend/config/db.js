const mongoose = require('mongoose');

// connect to db 
// const db = mongoose.connect("mongodb://localhost:27017/MERN-CHAt-APP").then(() => {console.log('connected successfully !!') }).catch((err) => { console.log(err) })
const db = mongoose.connect("mongodb+srv://mansigabani231:vwG5xJv9WG3vZgZ5@mern-chat-app.rymtaoj.mongodb.net/?retryWrites=true&w=majority").then(() => {
    console.log('connection successfull')
 }).catch((err) => { console.log(err,'-----failed connection') })

module.exports = db