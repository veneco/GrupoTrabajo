const express = require('express')
const router = express.Router()
const Rol = require('../models/rol')
const auth = require('../middleware/auth')
const upload = require('../middleware/file')

// CREAR ROLES
router.post('/createrol', async(req, res)=>{
    let rol = await Rol.findOne({name: req.body.name})
    if(rol) return res.status(400).send('Ese rol ya existe')
    rol = new Rol({
        name: req.body.name,
        valor: req.body.valor,
        description: req.body.description
    })

    const result = await rol.save()
    res.status(200).send({result})
})

//LLAMAR TODOS LOS ROLES
router.get('/list', auth, async(req, res)=>{
    const rol = await Rol.find()
    if(!rol) return res.status(400).send('Roles no esta en Base de Datos')

    res.send(rol)
})

//ACTUALIZAR ROL
router.put('/update', auth, async(req, res)=>{
//CONSULTAR SI EL ROL EXISTE
    const rol = await Rol.findOne({"name":req.body.name})
    if(!rol) return res.status(400).send('No hay rol')

    //SI EXISTE SE ACTUALIZA
    const actRol = await Rol.findOneAndUpdate({"name":req.body.name},{
        name: req.body.name,
        valor: req.body.valor,
        description: req.body.description
    })
    if(!actRol){
        return res.status(404).send('No hay rol para actualizar')
    }
    res.status(200).send({message: 'actualizado'})
})


module.exports = router