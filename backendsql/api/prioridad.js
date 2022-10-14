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

module.exports = router;