const db = require ("../models");
const express = require('express');
const { Sequelize } = require("../models");
const router = express.Router();
const auth = require('../middleware/auth')

router.get('/list',auth, async (req, res) => {
    let grupoUser = req.user.grupo
    try {
        let tasks = await db.sequelize.query(
            "select * from tarea A"+
            " LEFT JOIN (SELECT TAREA_ID, USUARIO_ID, REASIGNADA FROM DETALLETAREA)B"+
            " ON A.ID = B.TAREA_ID"+
            " LEFT JOIN (SELECT ID AS IDRESPONSABLE, GRUPOTRABAJO_ID, nombre || ' ' || apellidop AS RESPONSABLE FROM USUARIO)C"+
            " ON B.USUARIO_ID = C.IDRESPONSABLE where B.REASIGNADA = 0 AND A.DELETED = 0 AND C.GRUPOTRABAJO_ID = "+ grupoUser +" ORDER BY A.FLUJO_IN_ID"
        )
        res.status(200).send(tasks[0])
    } catch (error) {
        res.status(400).send('no se pudo logear '+ error)
    }
   
});

router.get('/flujos',auth, async (req, res) => {
    let grupoUser = req.user.grupo
    try {
        let flujo = await db.flujo.findAll({ where: { GRUPOTRABAJO_ID: grupoUser} })
        res.status(200).send(flujo)
    } catch (error) {
        res.status(400).send('no se pudo logear '+ error)
    }
   
});

router.get('/rol',auth, async (req, res) => {
    let iduser = req.user.id
        try {
            let user = await db.usuario.findOne({ where: { ID: iduser } })
            res.status(200).send(user)
        } catch (error) {
            res.status(400).send(error)
        }

   
});

router.get('/grupo',auth, async (req, res) => {
    let usuario = await req.user;
    let grupotrabajoId = req.user.grupo

        try {
            let grupo = await db.sequelize.query(
                "select * from tarea A"+
                " LEFT JOIN (SELECT TAREA_ID, USUARIO_ID, REASIGNADA FROM DETALLETAREA)B"+
                " ON A.ID = B.TAREA_ID"+
                " LEFT JOIN (SELECT ID AS IDRESPONSABLE, GRUPOTRABAJO_ID, nombre || ' ' || apellidop AS RESPONSABLE FROM USUARIO)C"+
                " ON B.USUARIO_ID = C.IDRESPONSABLE where B.REASIGNADA = 0 AND A.DELETED = 0"
            )
            res.status(200).send(grupo)
        } catch (error) {
            res.status(400).send(error)
        }

   
});



router.post('/new', async(req, res) => {
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