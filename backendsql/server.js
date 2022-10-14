const express = require('express')
const bodyParser = require('body-parser')
const users = require('./api/users')
const auth = require('./api/auth')
const flujo = require('./api/flujo')
const task = require('./api/task')
const prioridad = require('./api/prioridad')


const app = express();
const cors = require('cors')
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/api/users', users)
app.use('/api/auth', auth)
app.use('/api/flujo', flujo)
app.use('/api/task', task)
app.use('/api/prioridad', prioridad)

const port = process.env.PORT || 3003
app.listen(port, () => console.log('conectado en el puerto '+ port));
