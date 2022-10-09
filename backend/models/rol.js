const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    name: String,
    description: String,
    valor: String,
    date: {type:Date, default: Date.now}
})

const Rol = mongoose.model('rol', taskSchema)

module.exports = Rol