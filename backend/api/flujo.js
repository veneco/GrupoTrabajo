const db = require ("../models");
const express = require('express');
const { Sequelize } = require("../models");
const router = express.Router();
const auth = require('../middleware/auth')


//LLAMAR LOS FLUJOS
router.get('/list',auth, async (req, res) => {
    let id = req.user.id;
    let rol = req.user.rol
    let userData = req.user
    let grupoTrabajo = req.user.grupo;
    let flujo = []
    try {
        if(rol==5){
            flujo = await db.sequelize.query(
                "select * from flujo_in A LEFT JOIN (SELECT  tarea.FLUJO_IN_ID, round(SUM(avance)/COUNT(avance)) AS AVANCETOTAL"+
                " FROM tarea where deleted = 0 GROUP BY flujo_in_id) B ON A.id = B.FLUJO_IN_ID JOIN(select FLUJO_IN_ID  from tarea C "+
                " LEFT JOIN (SELECT  USUARIO_ID, TAREA_ID FROM detalletarea ) E ON C.id = E.TAREA_ID " +
                " GROUP BY C.FLUJO_IN_ID)D ON A.ID = D.FLUJO_IN_ID WHERE A.DELETED = 0 AND A.GRUPOTRABAJO_ID = "+grupoTrabajo+ "ORDER BY A.ID DESC")  
        }
        else{
            flujo = await db.sequelize.query(
                "select * from flujo_in A LEFT JOIN (SELECT  tarea.FLUJO_IN_ID, round(SUM(avance)/COUNT(avance)) AS AVANCETOTAL"+
                " FROM tarea where deleted = 0 GROUP BY flujo_in_id) B ON A.id = B.FLUJO_IN_ID JOIN(select FLUJO_IN_ID  from tarea C "+
                " LEFT JOIN (SELECT  USUARIO_ID, TAREA_ID FROM detalletarea ) E ON C.id = E.TAREA_ID where USUARIO_ID = "+id +
                " GROUP BY C.FLUJO_IN_ID)D ON A.ID = D.FLUJO_IN_ID WHERE A.DELETED = 0 AND A.GRUPOTRABAJO_ID = "+grupoTrabajo+ "ORDER BY A.ID DESC")  
        }
        
            res.status(200).send({flujo, userData})
    } catch (error) {
        res.status(400).send('no se pudo logear '+ error)
    }
   
});

//LLAMAR LOS FLUJOS
router.get('/flujoPL',auth, async (req, res) => {

    let negocio = req.user.negocio;
    const tarea = []
    try {

        const flujo = await db.sequelize.query(
            "select * from FLUJO_PL where negocio_id = "+ negocio)
            for (let index = 0; index < flujo.length; index++) {
                let temp = await db.sequelize.query(
                    "select * from tarea_pl  where flujo_pl_id = "+flujo[0][index].ID+" ORDER BY ORDEN;") 
                    tarea.push(temp[0])
  
            }
         
        res.status(200).send({flujo,tarea})
    } catch (error) {
        res.status(400).send('no se pudo logear '+ error)
    }
   
});
router.post('/', auth, async(req, res) => {

    let RESPONSABLE =req.user.id;//ASIGNAR RESPONSABLE POR EL FRONT
    let NOMBRE =req.body.nombre;//
    let DESCRIPCION = req.body.descripcion;//
    let FECHAINICIO =req.body.fechainicio;
    let DELETED =req.body.deleted;
    let GRUPOTRABAJO_ID =req.user.grupo;

    try {
        let tarea = await db.flujo.create({     
            RESPONSABLE,     
            NOMBRE,
            DESCRIPCION,
            FECHAINICIO,
            DELETED,
            GRUPOTRABAJO_ID,           
        });
        res.status(200).send(tarea)
    } catch (error) {
        res.status(400).send('no se pudo crear el usuario por '+ error)
    }

    });

module.exports = router;