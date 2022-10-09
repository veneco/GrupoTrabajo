const express = require('express')
const router = express.Router()
const Flujo = require('../models/flujo')
const auth = require('../middleware/auth')
const upload = require('../middleware/file')

// CREAR ROLES
router.post('/create', async(req, res)=>{
    let flujo = await Flujo.findOne({name: req.body.name})
    if(flujo) return res.status(400).send('Este flujo ya existe')
    flujo = new Flujo({
        name: req.body.name,
        valor: req.body.valor,
        description: req.body.description
    })

    const result = await flujo.save()
    res.status(200).send({result})
})

//LLAMAR TODOS LOS ROLES
router.get('/list', auth, async(req, res)=>{
    const flujo = await Flujo.find()
    if(!flujo) return res.status(400).send('Roles no esta en Base de Datos')

    res.send(flujo)
})

//ACTUALIZAR ROL
router.put('/update', auth, async(req, res)=>{
//CONSULTAR SI EL ROL EXISTE
    const flujo = await Flujo.findOne({"name":req.body.name})
    if(!rol) return res.status(400).send('No hay rol')

    //SI EXISTE SE ACTUALIZA
    const actFlujo = await Flujo.findOneAndUpdate({"name":req.body.name},{
        name: req.body.name,
        valor: req.body.valor,
        description: req.body.description
    })
    if(!actFlujo){
        return res.status(404).send('No hay rol para actualizar')
    }
    res.status(200).send({message: 'actualizado'})
})


module.exports = router