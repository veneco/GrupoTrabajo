const db = require ("../models");
const express = require('express');
const { Sequelize } = require("../models");
const router = express.Router();
const auth = require('../middleware/auth')

// REPORTAR PROBLEMA 
router.post('/',auth, async (req, res) => {
    let USUARIO_ID = req.user.id
    let TAREA_ID =req.body.ID;
    let COMENTARIO =req.body.COMENTARIO;
    let FINALIZADA = 0
    let ESTADO_ID = 1
    let FECHA = Date()
    try {
        let bug = await db.problema.create({
            COMENTARIO,     
            TAREA_ID,
            FECHA,
            USUARIO_ID,
            FINALIZADA,
            ESTADO_ID
        });
        res.status(200).send(bug)
    } catch (error) {
        res.status(400).send('no se pudo logear '+ error)
    }
   
});

//LLAMADA DE LOS PROBLEMAS POR GRUPO
router.get('/',auth, async (req, res) => {
    let idgrupo = req.user.grupo
    let bug = []
        try {
            let problemas = await db.sequelize.query(
                "select * from problema_t A"+
                " LEFT JOIN (SELECT ID AS IDESTADO, NOMBRE FROM estado ) B"+
                " ON A.ESTADO_ID = B.IDESTADO" +
                " LEFT JOIN (SELECT ID AS IDTAREA, NOMBRE AS NOMBRETAREA, FLUJO_IN_ID FROM tarea ) C"+
                " ON A.TAREA_ID = C.IDTAREA" +
                " JOIN (select ID AS IDUSUARIO,  nombre || ' ' || apellidop || ' ' || apellidom AS CREADOPOR from usuario where grupotrabajo_id = "+idgrupo+" ) D"+
                " ON A.usuario_id = D.IDUSUARIO where A.ESTADO_ID = 1 ORDER BY A.FECHA DESC"
            )
                
            problemas[0].forEach(element => {
                let temp = 
                {
                    BugID: element.ID,
                    BugComentario: element.COMENTARIO,
                    Fecha: element.FECHA.toISOString().split('T')[0],
                    Finalizada: element.FINALIZADA,
                    Estado: element.IDESTADO,
                    TaskID: element.TAREA_ID,
                    TaskName: element.NOMBRETAREA,
                    FlujoID: element.FLUJO_IN_ID,
                    CreadoPor: element.CREADOPOR,

                }
                bug.push(temp)
            });
            res.status(200).send(bug)
        } catch (error) {
            res.status(400).send(error)
        }

   
});
//LLAMAR LOS ESTADOS RESOLUTORIOS DE LOS PROBLEMAS
router.get('/estado',auth, async (req, res) => {

        try {
            let grupo = await db.estado.findAll()
            res.status(200).send(grupo)
        } catch (error) {
            res.status(400).send(error)
        }

   
});

//ACTUALIZAR TABLA PROBLEMA_T
router.put('/finishProblem', auth, async(req, res) => {
   
    let BUGID = req.body.BugID;
    let ESTADO_ID =req.body.Estado

    try {
        const problema = await db.problema.findOne({ where: { ID: BUGID} })
        if(!problema) return res.status(400).send('problema no existe')
        const update = await db.problema.update(
            {
                ESTADO_ID: ESTADO_ID,
            },
            {where:{ID: BUGID}
        })
       
      
        res.status(200).send(update)
    } catch (error) {
        res.status(400).send('no se pudo crear el usuario por '+ error)
    }

    });

module.exports = router;