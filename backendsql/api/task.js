const db = require ("../models");
const express = require('express');
const { Sequelize } = require("../models");
const router = express.Router();
const auth = require('../middleware/auth')

//LLAMAR TAREAS
router.post('/list', auth, async (req, res) => {
    let id =req.user.id;
    let status = req.body.id;
    let rol = req.user.rol;
    let grupoTrabajo = req.user.grupo;

    try {

        //LLAMAR TAREA SEGUN ROL -- ADMINISTRADOR EJECUTIVO
        if(rol == 1)
        {
            const task = await db.task.findAll({ where: { flujoproceso_id: status, grupotrabajo_id: grupoTrabajo } })
            if(!task) return res.status(200).send('Usuario no tiene tareas')
            res.status(200).send(task)
        }
        else{

            // EJECUTIVO
            const task = await db.task.findAll({ where: { responsable: id, flujoproceso_id: status } })
            if(!task) return res.status(200).send('Usuario no tiene tareas')
    
            res.status(200).send(task)
        }
    } catch (error) {
        res.status(400).send('no se pudo logear '+ error)
    }
   
});

router.get('/:id', auth, async (req, res) => {
    let idTask = req.params.id;

    try {
            const task = await db.task.findOne({ where: { id: idTask } })
            if(!task) return res.status(200).send('tarea no existe')
            res.status(200).send(task)
        }

    catch (error) {
        res.status(400).send('no se pudo logear '+ error)
    }
   
});

//CREAR TAREA
router.post('/', auth, async(req, res) => {
    let finalizada =req.body.finalizada;
    let creadapor =req.body.creadapor;
    let nombre =req.body.nombre;
    let descripcion = req.body.descripcion;
    let responsable =req.body.responsable;
    let fechainicio =req.body.fechainicio;
    let fechafin =req.body.fechafin;
    let esflujo =req.body.flujotarea;
    let deleted =req.body.deleted;
    let flujoproceso_id =req.body.flujoproceso;
    let grupotrabajo_id =req.body.grupotrabajo;
    let estadotarea_id =req.body.estadotarea;
    let prioridad_id =req.body.prioridad;
    let etiqueta_id =req.body.etiqueta;

    try {
        let tarea= await db.task.create({          
            finalizada,
            creadapor,
            nombre,
            descripcion,
            responsable,
            fechainicio,
            fechafin,
            esflujo,
            deleted,
            flujoproceso_id,
            grupotrabajo_id,
            estadotarea_id,
            prioridad_id,
            etiqueta_id
        });

        res.status(200).send(tarea)
    } catch (error) {
        res.status(400).send('no se pudo crear el usuario por '+ error)
    }

    });
    //ACTUALIZAR ESTADO DE LA TAREA
    router.put('/', auth, async (req, res) => {
        console.log(req.body)
        let idtask = req.body.id;
        let finalizada = req.body.finalizada;
        let creadapor = req.body.creadapor;
        let nombre = req.body.nombre;
        let responsable= req.body.responsable;
        let fechainicio = req.body.fechainicio;
        let fechafin = req.body.fechafin;
        let esflujo = req.body.esflujo;
        let deleted = req.body.deleted;        
        let grupotrabajo_id = req.body.grupotrabajo;
        let estadotarea_id = req.body.estadotarea;
        let prioridad_id = req.body.prioridad;
        let etiqueta_id = req.body.etiqueta;
        let flujoproceso_id = req.body.flujoproceso;

        try {
            const task = await db.task.findOne({ where: { id: idtask} })
            if(!task) return res.status(400).send('tarea no existe')
            const update = await db.task.update(
                {flujoproceso_id: flujoproceso_id,
                    finalizada: finalizada,
                    creadapor: creadapor,
                    nombre: nombre,
                    responsable: responsable,
                    fechainicio: fechainicio,
                    fechafin: fechafin,
                    esflujo: esflujo,
                    deleted: deleted,        
                    grupotrabajo_id: grupotrabajo_id,
                    estadotarea_id: estadotarea_id,
                    prioridad_id: prioridad_id,
                    etiqueta_id: etiqueta_id,
                    flujoproceso_id: flujoproceso_id
                },
            {where:{id: idtask}
            })
            const taskUpdate = await db.task.findOne({ where: { id: idtask} })
            res.status(200).send(taskUpdate)
        } catch (error) {
            res.status(400).send('no se pudo logear '+ error)
        }      
    });

module.exports = router;