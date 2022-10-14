const db = require ("../models");
const express = require('express');
const { Sequelize } = require("../models");
const router = express.Router();
const jwt = require('jsonwebtoken')

//LOGEARSE
router.post('/', async (req, res) => {
    let correo =req.body.correo;
    let password =req.body.password;

    try {
        const user = await db.usuario.findOne({ where: { correo: correo } })
        if(!user) return res.status(400).send('Usuario no esta en Base de Datos')
        if(user.password !== password) return res.status(400).send('Usuario o contraseña son incorrectos')
        if(user.deleted !== 0) return res.status(400).send('Usuario bloqueado')
        const jwtToken = jwt.sign({
            correo: correo,
            rut: user.rut,
            rol: user.rol_id,
            id: user.id,
            grupo: user.grupotrabajo_id,    
        }, "secretKey")

        res.status(200).send({jwtToken})
    } catch (error) {
        res.status(400).send('no se pudo logear '+ error)
    }
   
});



module.exports = router;