const db = require ("../models");
const express = require('express');
const { Sequelize } = require("../models");
const router = express.Router();
const auth = require('../middleware/auth')

router.post('/list', auth, async (req, res) => {
    let id =req.user.id;
    let status = req.body.id;
    let rol = req.user.rol;
    try {
        if(rol == 1)
        {
            const task = await db.task.findAll({ where: { flujoproceso_id: status } })
            if(!task) return res.status(200).send('Usuario no tiene tareas')
    
            res.status(200).send(task)
        }
        else{
            const task = await db.task.findAll({ where: { responsable: id, flujoproceso_id: status } })
            if(!task) return res.status(200).send('Usuario no tiene tareas')
    
            res.status(200).send(task)
        }
    } catch (error) {
        res.status(400).send('no se pudo logear '+ error)
    }
   
});


router.post('/new', auth, async(req, res) => {
    let correo =req.body.correo;
    let password =req.body.password;
    let rut = req.body.rut;
    let nombre =req.body.nombre;
    let apellidop =req.body.apellidop;
    let apellidom =req.body.apellidom;
    let celular =req.body.celular;
    let deleted =req.body.deleted;
    let rol_id =req.body.rol_id;
    let negocio_id =req.body.negocio_id;
    let grupotrabajo_id =req.body.grupotrabajo_id;

    try {
        let count = await db.usuario.count()
        let user= await db.usuario.create({          
                id:count,
                correo,
                password,
                rut,
                nombre,
                apellidop,
                apellidom,
                celular,
                deleted,
                rol_id,
                negocio_id,
                grupotrabajo_id,
        });

        const jwtToken = user.generateJWT();

        res.status(200).send(JSON.stringify(count))
    } catch (error) {
        res.status(400).send('no se pudo crear el usuario por '+ error)
    }

    });

module.exports = router;