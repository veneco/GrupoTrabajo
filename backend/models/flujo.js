const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    name: String,
    description: String,
    valor: String,
    date: {type:Date, default: Date.now}
})

const Flujo = mongoose.model('flujo', taskSchema)

module.exports = Flujo