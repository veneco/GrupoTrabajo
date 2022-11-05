const db = require ("../models");
const express = require('express');
const { Sequelize } = require("../models");
const router = express.Router();
const auth = require('../middleware/auth')

//LLAMAR TAREAS
router.get('/:id', auth, async (req, res) => {
    let idtask = req.params.id
    let idUser = req.user.id
    let taskFlujo = []
    let myTasks = []
    let avance = 0
    try {

            const task = await db.sequelize.query(
                "select * from tarea A LEFT JOIN (SELECT  USUARIO_ID, TAREA_ID, ACEPTA, RECHAZA, REASIGNADA FROM detalletarea ) B"+
                " ON A.id = B.TAREA_ID LEFT JOIN (SELECT ID AS IDRESPONSABLE," +
                    " nombre || ' ' || apellidop || ' ' || apellidom AS RESPONSABLE FROM usuario)C"+
                    " ON B.USUARIO_ID = C.IDRESPONSABLE  WHERE FLUJO_IN_ID ="+ idtask+" AND B.REASIGNADA = 0 ORDER BY ORDEN") 
            /*await db.task.findAll({ where: { FLUJO_IN_ID: idtask },
                order: [['ORDEN', 'ASC']] })*/
            if(!task) return res.status(200).send('Usuario no tiene tareas')
            task[0].forEach( (element, index) => {
                let temp
                if (idUser == element.IDRESPONSABLE && element.RECHAZA == "0") {
                    temp = 
                    {
                        TaskID: element.ID,
                        TaskName: element.NOMBRE,
                        Avance: element.AVANCE,
                        Finalizada: element.FINALIZADA,
                        Acepta: element.ACEPTA,
                        Rechaza: element.RECHAZA,
                        Orden: (element.ORDEN+1)
                    }
                    myTasks.push(temp)
                } 
                if(element.SUBTAREA == 0 || element.ORDEN == 0){
                    temp = 
                    {
                        TaskID: (element.ORDEN+1),
                        TaskName: element.NOMBRE,
                        StartDate: element.FECHAINICIO,
                        EndDate: element.FECHAFIN,
                        Responsable: element.RESPONSABLE,
                        Predecessors: element.PREDECEDORA,
                        Progress: element.AVANCE,
                        Duration: element.DURACION,
                        subtasks: []
                    }
                    taskFlujo.push(temp)
                    }
                    else{
                        temp =  {
                            TaskID: (element.ORDEN+1),
                            TaskName: element.NOMBRE,
                            StartDate: element.FECHAINICIO,
                            EndDate: element.FECHAFIN,
                            Predecessors: element.PREDECEDORA,
                            Responsable: element.RESPONSABLE,
                            Progress: element.AVANCE,
                            Duration: element.DURACION,
                            subtasks: [] 
                    }
                    taskFlujo[taskFlujo.length-1].subtasks.push(temp)
                    }
                    avance = avance + element.AVANCE
                 
            });
            avance = Math.round(avance / task[0].length)
            res.status(200).send({myTasks,taskFlujo, avance})


    } catch (error) {
        res.status(400).send('no se pudo logear '+ error)
    }
   
});
//ACTUALIZAR TAREA
router.put('/', auth, async (req, res) => {
    let idTask = req.body.TaskID
    let AVANCE = req.body.Avance
    let ACEPTA = req.body.Avance
    let RECHAZA = req.body.Rechaza

    try {
        const taskDetalle = await db.task.findOne({ where: { ID: idTask} })
        if(!taskDetalle) return res.status(400).send('tarea no existe')
        const update = await db.task.update(
            {AVANCE: AVANCE,
            ACEPTA: ACEPTA,
            RECHAZA:RECHAZA},
            {where:{ID: idTask}
        })
            res.status(200).send(update)
        }

    catch (error) {
        res.status(400).send('no se pudo logear '+ error)
    }
   
});

router.put('/acepRecha', auth, async (req, res) => {
    let idTask = req.body.TaskID
    let ACEPTA = req.body.Acepta
    let RECHAZA = req.body.Rechaza
    try {
        const taskDetalle = await db.detalleTask.findOne({ where: { TAREA_ID: idTask} })
        if(!taskDetalle) return res.status(400).send('tarea no existe')
        const update = await db.detalleTask.update(
            {ACEPTA: ACEPTA,
            RECHAZA:RECHAZA},
            {where:{TAREA_ID: idTask}
        })
            res.status(200).send(update)
        }

    catch (error) {
        res.status(400).send('no se pudo logear '+ error)
    }
   
});
router.post('/not', auth, async (req, res) => {
    let idUser = req.user.id
    let rol = req.user.rol
    let grupo = req.user.grupo
    let envioNoti =[]
    let notificaciones = []
    try {    
        if(rol == 4){
            notificaciones = await db.sequelize.query(
                "select * from detalletarea A"+
                " LEFT JOIN (SELECT  ID AS IDTAREA, FLUJO_IN_ID, NOMBRE AS NOMBRETAREA FROM tarea ) B" +
                " ON A.TAREA_ID = B.IDTAREA"+
                " LEFT JOIN (SELECT  ID AS IDFLUJO, DESCRIPCION AS NOMBREFLUJO FROM FLUJO_IN ) C"+
                " ON B.FLUJO_IN_ID = C.IDFLUJO"+
                " where A.ACEPTA = 0 AND A.RECHAZA = 0 AND A.REASIGNADA = 0 AND A.USUARIO_ID = "+ idUser +" ORDER BY FECHA DESC;") 
        }
        else{
            notificaciones = await db.sequelize.query(
                "select * from detalletarea A"+
                " LEFT JOIN (SELECT  ID AS IDTAREA, FLUJO_IN_ID, NOMBRE AS NOMBRETAREA FROM tarea ) B" +
                " ON A.TAREA_ID = B.IDTAREA"+
                " LEFT JOIN (SELECT  ID AS IDFLUJO, DESCRIPCION AS NOMBREFLUJO, GRUPOTRABAJO_ID AS GRUPO FROM FLUJO_IN ) C"+
                " ON B.FLUJO_IN_ID = C.IDFLUJO"+
                " LEFT JOIN (SELECT  ID AS IDUSUARIO, NOMBRE || ' ' || APELLIDOP AS RESPONSABLE FROM USUARIO ) D"+
                " ON A.USUARIO_ID = D.IDUSUARIO"+
                " where A.ACEPTA = 0 AND A.RECHAZA = 1  AND A.REASIGNADA = 0 AND C.GRUPO = "+ grupo +" ORDER BY FECHA ASC;") 
        }           
            if(!notificaciones) return res.status(200).send('Usuario no tiene notificaciones')
            let index = -1
            let temp
            let ultimoFlujo
            let flujo =[]
            notificaciones[0].forEach( (element) => {
                
                if(envioNoti.length ==0 || ultimoFlujo != element.IDFLUJO){
                    ultimoFlujo = element.IDFLUJO
                    temp = 
                    {
                        flujoName: element.NOMBREFLUJO,
                        flujoID: element.IDFLUJO,
                        Responsable: element.RESPONSABLE,
                        fecha: element.FECHA, 
                        tareas: []
                    }                 
                    envioNoti.push(temp)
                    index++ 
                    }
                temp = 
                {
                    flujoID: element.IDFLUJO,
                    taskName: element.NOMBRETAREA,
                    taskID: element.TAREA_ID,
                    usuarioID: element.IDUSUARIO,
                    Reasignado: 0,
                }
                envioNoti[index].tareas.push(temp)    
 
            });
            res.status(200).send(envioNoti)


    } catch (error) {
        res.status(400).send('no se pudo logear '+ error)
    }
   
});

//CREAR TAREA
router.post('/:id', auth, async(req, res) => {
    let largo = Object.keys(req.body).length 
    let idTask = req.params.id;
    let responsable =req.body.responsable
    let tarea
    let ACEPTA = 0
    let RECHAZA = 0
    let REASIGNADA = 0
    try {
    for (let i = 0; i < largo; i++) {     
    let ORDEN =req.body[i].TAREA.ORDEN;//
    let FINALIZADA ='0'; //
    let NOMBRE =req.body[i].TAREA.NOMBRE;//
    let DESCRIPCION = req.body[i].TAREA.DESCRIPCION;//
    let DURACION =req.body[i].TAREA.DURACION;
    let FECHAINICIO =req.body[i].FECHAINICIO;
    let FECHAFIN =req.body[i].FECHAFIN;
    let AVANCE =0;
    let DELETED = 0;
    let FLUJO_IN_ID =req.params.id;
    let PREDECEDORA =req.body[i].TAREA.PREDECEDORA;
    let SUBTAREA =req.body[i].TAREA.DE_SUBTAREA;
    let ETIQUETA_ID =1;
    let USUARIO_ID =req.body[i].RESPONSABLE;
   
    let FECHA = Date()
         tarea= await db.task.create({ 
            ORDEN,     
            FINALIZADA,
            NOMBRE,
            DESCRIPCION,
            DURACION,
            FECHAINICIO,
            FECHAFIN,
            AVANCE,
            DELETED,
            FLUJO_IN_ID,
            PREDECEDORA,
            SUBTAREA,
            ETIQUETA_ID,
            
        });
        let TAREA_ID = tarea.ID
        await db.detalleTask.create({ACEPTA, RECHAZA, REASIGNADA, USUARIO_ID,TAREA_ID,FECHA})
    }   
        res.status(200).send(tarea)
    } catch (error) {
        res.status(400).send('no se pudo crear el usuario por '+ error)
    }

    });
    //ACTUALIZAR ESTADO DE LA TAREA
    router.put('/', auth, async (req, res) => {
        let idtask = req.body.id;
        let finalizada = req.body.finalizada;
        let creadapor = req.body.creadapor;
        let nombre = req.body.nombre;
        let responsable= req.body.responsable;
        let fechainicio = req.body.fechainicio;
        let fechafin = req.body.fechafin;
        let esflujo = req.body.esflujo;
        let deleted = req.body.deleted;        
        let grupotrabajo_id = req.body.grupoTrabajo;
        let estadotarea_id = req.body.estadotarea;
        let prioridad_id = req.body.prioridad;
        let etiqueta_id = req.body.etiqueta;
        let flujoproceso_id = req.body.flujoproceso;

        try {
            const task = await db.task.findOne({ where: { ID: idtask} })
            if(!task) return res.status(400).send('tarea no existe')
            const update = await db.task.update(
                {FLUJOPROCESO_ID: flujoproceso_id,
                    FINALIZADA: finalizada,
                    CREADAPOR: creadapor,
                    NOMBRE: nombre,
                    DESCRIPCION: responsable,
                    FECHAINICIO: fechainicio,
                    FECHAFIN: fechafin,
                    ESFLUJO: esflujo,
                    DELETED: deleted,        
                    GRUPOTRABAJO_ID: grupotrabajo_id,
                    ESTADOTAREA_ID: estadotarea_id,
                    PRIORIDAD_ID: prioridad_id,
                    ETIQUETA_ID: etiqueta_id,
                    FLUJOPROCESO_ID: flujoproceso_id
                },
            {where:{ID: idtask}
            })
            const taskUpdate = await db.task.findOne({ where: { ID: idtask} })
            res.status(200).send(taskUpdate)
        } catch (error) {
            res.status(400).send('no se pudo logear '+ error)
        }      
    });

//REASIGTAR TAREA
router.put('/reasignar', auth, async(req, res) => {
   
    let USUARIO_ID = req.body.usuarioID;
    let TAREA_ID =req.body.taskID
    let ACEPTA = 0
    let RECHAZA = 0
    let REASIGNADA = 0
    let FECHA = Date()
    try {
        const task = await db.detalleTask.findOne({ where: { TAREA_ID: TAREA_ID} })
        if(!task) return res.status(400).send('tarea no existe')
        const update = await db.detalleTask.update(
            {
                REASIGNADA: 1,
            },
            {where:{TAREA_ID: TAREA_ID}
        })
        const reasignacion = await db.detalleTask.create({ACEPTA, RECHAZA, REASIGNADA, USUARIO_ID,TAREA_ID,FECHA})
      
        res.status(200).send(reasignacion)
    } catch (error) {
        res.status(400).send('no se pudo crear el usuario por '+ error)
    }

    });
    
module.exports = router;