db = require('./models')
const express = require('express')
const bodyParser = require('body-parser')
const users = require('./api/users')
const auth = require('./api/auth')
const flujo = require('./api/flujo')
const task = require('./api/task')
const problema = require('./api/problema')
const report = require('./api/report')
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
app.use('/api/problema', problema)
app.use('/api/report', report)

const port = process.env.PORT || 3003
app.listen(port, () => console.log('conectando...'));
db.sequelize.authenticate()
.then (() => console.log('conectado a la base de datos'))
.catch((e) => console.log("fallo " + e))

