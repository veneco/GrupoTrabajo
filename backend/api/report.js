const db = require ("../models");
const express = require('express');
const { Sequelize } = require("../models");
const router = express.Router();
const auth = require('../middleware/auth')

router.get('/list',auth, async (req, res) => {
    let grupoUser = req.user.grupo
    let rol = req.user.rol;
    let tasks
    try {

        if(rol==8)
            {
                tasks = await db.sequelize.query(
                    "select * from tarea A"+
                    " LEFT JOIN (SELECT TAREA_ID, USUARIO_ID, REASIGNADA FROM DETALLETAREA)B"+
                    " ON A.ID = B.TAREA_ID"+
                    " LEFT JOIN (SELECT ID AS IDRESPONSABLE, GRUPOTRABAJO_ID, nombre || ' ' || apellidop AS RESPONSABLE FROM USUARIO)C"+
                    " ON B.USUARIO_ID = C.IDRESPONSABLE"+
                    " LEFT JOIN (SELECT ID AS IDFLUJO, DESCRIPCION AS NOMBREFLUJO FROM flujo_in)D" +
                    " ON A.FLUJO_IN_ID = D.IDFLUJO where B.REASIGNADA = 0 ORDER BY A.ID"
                )
            }
            else
            {
                tasks = await db.sequelize.query(
                    "select * from tarea A"+
                    " LEFT JOIN (SELECT TAREA_ID, USUARIO_ID, REASIGNADA FROM DETALLETAREA)B"+
                    " ON A.ID = B.TAREA_ID"+
                    " LEFT JOIN (SELECT ID AS IDRESPONSABLE, GRUPOTRABAJO_ID, nombre || ' ' || apellidop AS RESPONSABLE FROM USUARIO)C"+
                    " ON B.USUARIO_ID = C.IDRESPONSABLE"+
                    " LEFT JOIN (SELECT ID AS IDFLUJO, DESCRIPCION AS NOMBREFLUJO FROM flujo_in)D" +
                    " ON A.FLUJO_IN_ID = D.IDFLUJO" + 
                    " where B.REASIGNADA = 0 AND C.GRUPOTRABAJO_ID = "+ grupoUser +" ORDER BY A.ID"
                )
            }
        
        res.status(200).send(tasks[0])
    } catch (error) {
        res.status(400).send('no se pudo logear '+ error)
    }
   
});

router.get('/flujos',auth, async (req, res) => {
    let grupoUser = req.user.grupo
    let rol = req.user.rol;
    let flujo
    try {
        if(rol==8)
        {
            flujo = await db.sequelize.query(
                "select * from flujo_in A" +
                " LEFT JOIN (select ID AS IDUSER,  nombre || ' ' || apellidop || ' ' || apellidom AS RESPONSABLENOMBRE from USUARIO)B"+
                " ON A.RESPONSABLE = B.IDUSER  ORDER BY A.ID ASC"
            )
        }
        else
        {
            flujo = await db.sequelize.query(
                "select * from flujo_in A" +
                " LEFT JOIN (select ID AS IDUSER,  nombre || ' ' || apellidop || ' ' || apellidom AS RESPONSABLENOMBRE from USUARIO)B"+
                " ON A.RESPONSABLE = B.IDUSER WHERE GRUPOTRABAJO_ID = "+ grupoUser+" ORDER BY A.ID ASC"
            )
        }
        
        res.status(200).send(flujo[0])
    } catch (error) {
        res.status(400).send('no se pudo logear '+ error)
    }
   
});


router.get('/grupo',auth, async (req, res) => {
    let rol = req.user.rol;
    let grupotrabajoId = req.user.grupo
    let negocioId = req.user.negocio
    let grupo

        try {
            if(rol==8)
            {
                grupo = await db.sequelize.query(
                    "select * from usuario A" +
                    " LEFT JOIN (select ID AS IDGRUPO, NOMBRE AS NOMBREGRUPO from GRUPOTRABAJO) B"+
                    " ON A.GRUPOTRABAJO_ID = B.IDGRUPO WHERE NEGOCIO_ID = "+negocioId+" ORDER BY ID ASC"
                )
            }
            else{
                grupo = await db.sequelize.query(
                    "select * from usuario A" +
                    " LEFT JOIN (select ID AS IDGRUPO, NOMBRE AS NOMBREGRUPO from GRUPOTRABAJO) B"+
                    " ON A.GRUPOTRABAJO_ID = B.IDGRUPO WHERE GRUPOTRABAJO_ID = "+ grupotrabajoId+" ORDER BY ID ASC"
                )
            }
            
            res.status(200).send(grupo[0])
        } catch (error) {
            res.status(400).send(error)
        }

   
});



module.exports = router;