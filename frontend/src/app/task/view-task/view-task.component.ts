import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/service/task.service';
import { Router } from '@angular/router'
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/components/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styleUrls: ['./view-task.component.css']
})
export class ViewTaskComponent implements OnInit {

  constructor(
    private taskService: TaskService,
    private router: Router,
    public dialog: MatDialog) { }

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
          console.log(this.data)  
          
          
        },  
        err=>{
          console.log(err) 
        }     
      )
      
  }
  
   public toolbarOptions: string[] = ['Add'];
  public resourceFields: object = {
    id: "resourceId",
    name: "resourceName"
  }
  public labelOptions: object = {
    rightLabel: "resources",
    taskLabel: "TaskName"
  }
  public columnSettings: object[] = [
    {field: "TaskID", headerText: "ID"},
    {field: "TaskName", headerText: "Nombre"},
    {field: "Responsable", headerText: "Responsable"},
    {field: "Duration", headerText: "Duracion"},
    {field: "StartDate", headerText: "Fecha Inicio", format:"dd-MMM-yy"},
    { field: 'EndDate', headerText: "Fechafin", format:"dd-MMM-yy"},
    
   
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
  actuAceptRecha(task:any, opcional:any, AcepRacha:any){
    if(opcional==0)
      task.Acepta = AcepRacha
    if(opcional==1)
      task.Rechaza = AcepRacha
    this.taskService.setTaskEstado(task)
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
    const dialogRef = this.dialog.open(ConfirmDialogComponent,{
      width:'350px',
      data:'Seguro que desea rechazar la tarea?'
    });
    dialogRef.afterClosed().subscribe(
      res=>{ 
        if(res){
          this.actuAceptRecha(task,opcional,AcepRacha)
        }
      });
  }

}

