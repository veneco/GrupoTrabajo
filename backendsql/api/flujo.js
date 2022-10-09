const db = require ("../models");
const express = require('express');
const { Sequelize } = require("../models");
const router = express.Router();

router.get('/list', async (req, res) => {

    try {
        const flujo = await db.flujo.findAll({ where: { deleted: 0} })
 
        res.status(200).send(flujo)
    } catch (error) {
        res.status(400).send('no se pudo logear '+ error)
    }
   
});

module.exports = router;