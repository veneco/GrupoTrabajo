import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/service/task.service';
import { Router } from '@angular/router'
import  {MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/components/shared/confirm-dialog/confirm-dialog.component';
import { ErrorDialogComponent } from 'src/app/components/shared/error-dialog/error-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styleUrls: ['./view-task.component.css']
})
export class ViewTaskComponent implements OnInit {

  constructor(
    private taskService: TaskService,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: MatSnackBar) { }

  idTask = localStorage.getItem('flujo')
  public data: any[] = [];
  public myTasks:any = [];
  public timezoneValue: string = 'UTC';
  public dayWorkingTime: object[]  = [{ from: 9, to: 18 }];
  temp:any[] = []
  prueba:boolean = true
  avance:any
  rol:any = localStorage.getItem('rol')
  flujo:any = localStorage.getItem('flujo')
  ngOnInit(): void {
    //LLAMA A LAS TAREAS PARA EL USUARIO ACTUAL LOGEADO
    this.taskService.getTask(this.idTask)
      .subscribe(
        res=>{
          
          this.avance = res.avance
          this.data = res.taskFlujo
          this.myTasks = res.myTasks
 
          
        },  
        err=>{
          console.log(err) 
        }     
      )
      
  }
  public resourceFields: object = {
    id: "resourceId",
    name: "resourceName"
  }
  public labelOptions: object = {
    rightLabel: "resources",
    taskLabel: "TaskName"
  }
  public columnSettings: object[] = [
    {field: "ID", headerText: "ID"},
    {field: "TaskName", headerText: "Nombre"},
    {field: "Responsable", headerText: "Responsable"},
    {field: "Duration", headerText: "Duracion"},  
   
  ]
  public taskSettings: object = {
    id: "TaskID",
    name: "TaskName",
    startDate: "StartDate",
    endDate: "EndDate",
    duration: "Duration",
    progress: "Progress",
    child: "subtasks",
    dependency: "Predecessors",
    Responsable: "Responsable"
  }
  public timelineSettings = {

  }
  bugButton(tarea:any)
  {
    let valor
    let tareaTemporal = this.data.filter((principal: any) => principal.TaskID == tarea.Orden)
    if(tareaTemporal.length == 0){valor = true}  
    else
    {
      
    if (tareaTemporal[0].subtasks.length == 0)
      valor = true
    else
      valor = false
    }
    return valor
    //let filterIndex = this.data.indexOf(filterTarea[0])
  }

//ACTUALIZAR ESTADO  SI EL PORCENTAJE DE AVANCE DE LA TAREA INCREMENTO
  actualizar(task:any){
    console.log(task)
    this.taskService.setTask(task)
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

//CERRAR FLUJO INSTANCIADO

cerrarFlujo()
{
  this.taskService.setFlujo(this.flujo)
      .subscribe(
        res=>{ 
          this.router.navigate(['/tasks'])
        },  
        err=>{
          console.log(err) 
        }     
      )
}
//ACTUALIZAR ESTADO DE LA TAREA YA SEA SI LA ACEPTO O LA RACHAZO
  actuAceptRecha(task:any, opcional:any, AcepRacha:any, Comentario:any = null){
    if(opcional==0)
      task.Acepta = AcepRacha
    if(opcional==1)
      task.Rechaza = AcepRacha
    this.taskService.setTaskEstado({task,Comentario})
      .subscribe(
        res=>{ 
          console.log(res)
         // location.reload();
        },  
        err=>{
          console.log(err) 
        }     
      )
  }

  //ENVIAR REPORTE DE BUG
  reportarBug(task:any){
    this.taskService.setTaskBug(task)
      .subscribe(
        res=>{ 
          console.log(res)
        },  
        err=>{
          console.log(err) 
        }     
      )
  }
  openDialogCerrarFlujo():void{
    const dialogRef = this.dialog.open(ConfirmDialogComponent,{
      width:'350px',
      data:'Seguro que desea terminar el flujo?'
    });
    dialogRef.afterClosed().subscribe(
      res=>{ 
        if(res){
          this.cerrarFlujo()
        }
      });
  }
  openDialogRechazarTarea(task:any, opcional:any, AcepRacha:any):void{
    const dialogRef = this.dialog.open(ErrorDialogComponent,{
      width:'350px',
      data:'Seguro que desea rechazar la tarea?'
    });
    dialogRef.afterClosed().subscribe(
      res=>{ 
        if(res==undefined){
          
          this.snackBar.open("No se envio el rechazo de la tarea", "Cerrar", {
            duration: 3000
          }) 
        }else{
          this.actuAceptRecha(task,opcional,AcepRacha, res)
        }
      });
  }
  openDialogBug(ID:any):void{
    const dialogRef = this.dialog.open(ErrorDialogComponent,{
      width:'350px',
      data:'Que error se presento en la tarea?'
    });
    dialogRef.afterClosed().subscribe(
      res=>{ 
        {
          if(res==undefined)
          {
            this.snackBar.open("No se envio el reporte de error", "Cerrar", {
              duration: 3000
            }) 
          }
          else
          {
            this.reportarBug({ID,COMENTARIO:res})
            this.snackBar.open("Se ha notificado al supervisor sobre el error", "Cerrar", {
              duration: 3000
            }) 
          } 
        }
      });
  }

}

