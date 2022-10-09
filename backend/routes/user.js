const express = require('express')
const router = express.Router()
const {User} = require('../models/user')
const auth = require('../middleware/auth')

router.post('/', async(req, res)=>{
    let user = await User.findOne({email: req.body.email})
    if(user) return res.status(400).send('Ese usuario ya existe')
    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })

    const result = await user.save()
    const jwtToken = user.generateJWT();
    res.status(200).send({jwtToken})
})

//LLAMAR USUARIO
router.get('/list', auth, async(req, res)=>{
    const user = await User.findById(req.user._id)
    if(!user) return res.status(400).send('Usuario no esta en Base de Datos')
 
    res.send(user)
})

module.exports = router