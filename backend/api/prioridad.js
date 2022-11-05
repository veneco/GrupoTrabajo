const db = require ("../models");
const express = require('express');
const { Sequelize } = require("../models");
const router = express.Router();
const auth = require('../middleware/auth')

//LLAMAR PRIORIDAD
router.get('/list', auth, async (req, res) => {

    try {
        const prioridad = await db.prioridad.findAll()
 
        res.status(200).send(prioridad)
    } catch (error) {
        res.status(400).send('no se pudo logear '+ error)
    }
   
});

router.get('/lists', auth, async (req, res) => {

    let ID =req.body.id;
    let NOMBRE =req.body.nombre;
    try {
        let prio= await db.prioridad.create({
            NOMBRE
        });
        res.status(200).send(prio)
    } catch (error) {
        res.status(400).send('no se pudo logear '+ error)
    }
   
});

module.exports = router;