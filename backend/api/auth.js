const db = require ("../models");
const express = require('express');
const { Sequelize } = require("../models");
const router = express.Router();
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

//LOGEARSE
router.post('/', async (req, res) => {
    let correo =req.body.correo;
    //encriptacion de la contraseña
    let passEnconde = crypto.createHash("sha256").update(req.body.password).digest()
    let password =passEnconde.toString('hex')
    let rol
    let nombre

    try {
        const user = await db.usuario.findOne({ where: { CORREO: correo } })
        if(!user) return res.status(400).send('Usuario no esta en Base de Datos')
        if(user.PASSWORD != password) return res.status(400).send('Usuario o contraseña son incorrectos')
        if(user.DELETED !== "0") return res.status(400).send('Usuario bloqueado')
        rol = user.ROL_ID
        nombre = user.NOMBRE +" "+ user.APELLIDOP
        const jwtToken = jwt.sign({
            correo: correo,
            rut: user.RUT,
            rol: user.ROL_ID,
            id: user.ID,
            grupo: user.GRUPOTRABAJO_ID, 
            negocio: user.NEGOCIO_ID,
            userNomC: user.NOMBRE +" "+user.APELLIDOP
        }, "secretKey")

        res.status(200).send({jwtToken, rol, nombre})
    } catch (error) {
        res.status(400).send('no se pudo logear '+ error)
    }
   
});



module.exports = router;