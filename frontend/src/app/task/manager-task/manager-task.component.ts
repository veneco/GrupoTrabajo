import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { TaskService } from 'src/app/service/task.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import  {MatDialog } from '@angular/material/dialog';
import { ActionDialogComponent } from 'src/app/components/shared/action-dialog/action-dialog.component';
import { ConfirmDialogComponent } from 'src/app/components/shared/confirm-dialog/confirm-dialog.component';
import { ErrorDialogComponent } from 'src/app/components/shared/error-dialog/error-dialog.component';
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
          console.log(res)
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
          console.log(res)
          
        },  
        err=>{
          console.log(err) 
        }     
      )
      
    this.taskService.getGrupo()
    .subscribe(
      res=>{
        this.responsable = res
        console.log(res)
      },  
      err=> console.log(err)       
    ),

    this.taskService.getTaskBug()
    .subscribe(
      res=>{
        this.bugReportado = res
        console.log(this.bugReportado)
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
             console.log(bug)
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
              //ACTUALIZAR PROBLEMAS_T
              this.taskService.setEstadoProblema(bug)
              .subscribe(
                res=>{ 
                  console.log(res)
                  location.reload();
                },  
                err=>{
                  console.log(err) 
                }     
              )
            }
          });


        break;
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
           
            }
          });
        break;

      case 4:
        console.log("caso 4")
        break;
    }
    
  }


}
