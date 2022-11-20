import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { TaskService } from 'src/app/service/task.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import  {MatDialog } from '@angular/material/dialog';
import { ActionDialogComponent } from 'src/app/components/shared/action-dialog/action-dialog.component';
import { ConfirmDialogComponent } from 'src/app/components/shared/confirm-dialog/confirm-dialog.component';
import { ErrorDialogComponent } from 'src/app/components/shared/error-dialog/error-dialog.component';
import * as _moment from 'moment'

const moment =  _moment;
@Component({
  selector: 'app-manager-task',
  templateUrl: './manager-task.component.html',
  styleUrls: ['./manager-task.component.css']
})
export class ManagerTaskComponent implements OnInit {

  constructor(private router: Router,
    private taskService: TaskService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar) { }
    dataSource:any
    responsable:any
    estadoAccion:any
    flujosRechazadas:any = []
    tareasRechazadas:any = []
    bugReportado:any = []
    displayedColumns: string[] = ['flujoID', 'Nombre', 'Rechazo Tarea', 'Comentario', 'Nuevo Responsable', 'Guardar'];
    bugColumns: string[] = ['BugID','FlujoID', 'TaskID','TaskName', 'CreadoPor', 'BugComentario','Accion', 'Resolver'];


  ngOnInit(): void {
    this.taskService.getNoti()
      .subscribe(
        res=>{

          for (let i = 0; i < res.length; i++) {
            this.flujosRechazadas.push(res[i])
            for (let j = 0; j < this.flujosRechazadas[i].tareas.length; j++) {
              this.tareasRechazadas.push(this.flujosRechazadas[i].tareas[j])
            }   
          }
        },  
        err=>{
          console.log(err) 
        }     
      ),
      this.taskService.getEstado()
      .subscribe(
        res=>{
          this.estadoAccion = res

          
        },  
        err=>{
          console.log(err) 
        }     
      )
      
    this.taskService.getGrupo()
    .subscribe(
      res=>{
        this.responsable = res

      },  
      err=> console.log(err)       
    ),

    this.taskService.getTaskBug()
    .subscribe(
      res=>{
        this.bugReportado = res
      },  
      err=> console.log(err)       
    )

   
  }

  //FILTRAR LAS TAREAS PARA QUE SE VEAN EN LA VISTA
  filtrarTarea(flujoID:any){

    const tareasFiltradas = this.tareasRechazadas.filter((tarea: any) => tarea.flujoID == flujoID)
    return tareasFiltradas
  }

// ASIGNAR EL NUEVO RESPONSABLE EN EL ARRAY 
  asignarResponsable(i:any, responsable:any){

    let index = this.tareasRechazadas.indexOf(i);
    this.tareasRechazadas[index].usuarioID= responsable
    this.tareasRechazadas[index].Reasignado= 1
   
  }

  //REALIZAR RESPONSABLE DE LA TAREA
  reasignarTarea(tarea:any){
    if(tarea.Reasignado == 1)
    {
      this.tareasRechazadas.splice(this.tareasRechazadas.indexOf(tarea))
      console.log("tarea reasignada")
      this.taskService.setReasignarTarea(tarea)
      .subscribe(
        res=>{
          console.log(res)
        },  
        err=> console.log(err)       
      )
    }
    else{
    this.snackBar.open("No se le ha asignado responsable a la tarea "+ tarea.taskName, "Cerrar", {
      duration: 2000
    })
    }
    
  }

  // CAMBIAR ESTADO ACCION EN EL ARRAY 
  asignarAccion(i:any, estado:any){

    let index = this.bugReportado.indexOf(i);
    this.bugReportado[index].Estado= estado
  }

  //FORMATO DE FECHAS
  formatDate(date: string, duracion = 0){
    
    let fecha = new Date(date) 
    fecha.setDate(fecha.getDate() + duracion);
    return fecha.toISOString().substring(0, fecha.toISOString().length - 1)
    

  }
//ENVIO DE LISTADO CON LAS NUEVAS FECHAS A LA BASE DE DATOS
  enviarFechasActu(listado:any)
  {
    this.taskService.setDateTasks(listado)
      .subscribe(
                res=>{
                  
                  console.log(res)
                },  
                err=> console.log(err)       
              )
  }

  //ACTUALIZAR PROBLEMAS_T
  actuProblema_T(bug:any){ 
    this.taskService.setEstadoProblema(bug)
    .subscribe(
      res=>{ 
        location.reload();
      },  
      err=>{
        console.log(err) 
      }     
    )
  }


  setEstado(bug:any){
    switch(bug.Estado)
    {//NO SELECCIONO NADA
      case 1:
        this.snackBar.open("Se debe seleccionar una accion valida en la tarea Nombre "+bug.TaskName+" ID#"+ bug.BugID, "Cerrar", {
          duration: 4000
    })
        break;
      //REASIGNAR
      case 2:
        const dialogReasignar = this.dialog.open(ConfirmDialogComponent,{
          width:'350px',
          data:'Seguro que desea reasignar esta tarea?'
        });
        dialogReasignar.afterClosed().subscribe(
          res=>{ 
            if(res==undefined){
              
              this.snackBar.open("No se envio la reasignacion de la tarea", "Cerrar", {
                duration: 3000
              }) 
            }else{
   
             // ACTUALIZAR DETALLESTAREA
             let Comentario = "Reasignado por " + localStorage.getItem('nombre')
             let task={TaskID: bug.TaskID, Acepta:1, Rechaza:1}
             this.taskService.setTaskEstado({task,Comentario})
              .subscribe(
                res=>{ 
                  console.log(res)
                },  
                err=>{
                  console.log(err) 
                }     
              )
              this.actuProblema_T(bug)
            }
          });


        break;
        //RECALCULO DE FECHAS DE LAS TAREAS
      case 3:
        
        const dialogDias = this.dialog.open(ErrorDialogComponent,{
          width:'350px',
          data:'Cuantos dias le asignara a la tarea?'

        });
        dialogDias.afterClosed().subscribe(
          res=>{ 
            if(res==undefined){
              
              this.snackBar.open("No se incrementaron los dias de la tarea", "Cerrar", {
                duration: 3000
              }) 
            }else{
              let diasIncremento = res
              let data:any
              let fechainicial:any

              this.taskService.getDateTasks(bug.FlujoID)
              .subscribe(
                res=>{
                  fechainicial = res[0].FECHAINICIO
                  data = res
                  let filterTarea = data.filter((tarea: any) => tarea.ID == bug.TaskID)
                  let filterIndex = data.indexOf(filterTarea[0])
                  data[filterIndex].DURACION = parseInt(diasIncremento) 
  
                  this.recalcularFechas(data, fechainicial)
                  
                },  
                err=> console.log(err)       
              )
              this.actuProblema_T(bug)
            }
          });
        break;
//NINGUNA ACCION TOMADA
      case 4:
        this.actuProblema_T(bug)
        break;
    }
    
  }
  recalcularFechas(data:any, fechainicial:any){
  
    let listado: any[]=[]
    let fechaInicio: any[]=[]
    let fechaFin: any[]=[]
    let ultimaPredecedora:any
    let duracionTotal:any
    
      Object.keys(data).forEach((key, index)=>{
        const tarea = data[key]
       
        if(tarea.DE_SUBTAREA != 0)
        {          

          if(tarea.PREDECEDORA == ultimaPredecedora+1){
            let fechatemporalInit= this.formatDate(fechaInicio[ultimaPredecedora])
            fechaInicio.push(fechatemporalInit)
            
            if(tarea.DURACION == duracionTotal){  
              duracionTotal = tarea.DURACION
              let fechatemporalFin= this.formatDate(fechaInicio[ultimaPredecedora],duracionTotal)
              fechaFin[ultimaPredecedora]=fechatemporalFin
              let fechatemporalfinsub= this.formatDate(fechaInicio[ultimaPredecedora],duracionTotal)
              fechaFin[index]=fechatemporalfinsub
            }            
            else{
              duracionTotal = duracionTotal+ tarea.DURACION
              let fechatemporalFin= this.formatDate(fechaInicio[ultimaPredecedora],duracionTotal)
              fechaFin[ultimaPredecedora]=fechatemporalFin
              let fechatemporalfinsub= this.formatDate(fechaInicio[ultimaPredecedora],duracionTotal)
              fechaFin[index]=fechatemporalfinsub   
            }
             
          }
          else{
            let fechatemporalInit= this.formatDate(fechaInicio[index-1],tarea.DURACION)
            fechaInicio.push(fechatemporalInit)
            let fechatemporalfinsub= this.formatDate(fechaInicio[index],tarea.DURACION)
            fechaFin.push(fechatemporalfinsub)           
          }        
        }
        else{  
          if (index == 0){
            
            let fechatemporal= this.formatDate(fechainicial)
            fechaInicio.push(fechatemporal) 
          }
          else{
            let fechatemporal= this.formatDate(fechaFin[index-1])
            fechaInicio.push(fechatemporal)
          }
          ultimaPredecedora = tarea.PREDECEDORA
            duracionTotal = 0
            
            if(tarea.SUBTAREA == '1')
            {
              let fechatemporal= '2000-10-10'
              fechaFin.push(fechatemporal)
            }        
            else{
              let fechatemporal= this.formatDate(fechaInicio[index],tarea.DURACION)
              fechaFin.push(fechatemporal)
            }
        }
        listado.push({TAREA:tarea , FECHAINICIO:fechaInicio[index], FECHAFIN:fechaFin[index]})
        
      })
      for (let index = 0; index < fechaFin.length; index++) {
        listado[index].FECHAFIN = fechaFin[index]
        
      }

      
      this.enviarFechasActu(listado)
  }



}
