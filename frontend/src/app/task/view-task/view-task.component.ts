import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/service/task.service';
@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styleUrls: ['./view-task.component.css']
})
export class ViewTaskComponent implements OnInit {

  constructor(private taskService: TaskService) { }
  idTask = localStorage.getItem('flujo')
  public data: object[] = [];
  public myTasks:any = [];
  prueba:boolean = true

  
  ngOnInit(): void {
    //LLAMA A LAS TAREAS PARA EL USUARIO ACTUAL LOGEADO
    this.taskService.getTask(this.idTask)
      .subscribe(
        res=>{

          this.data = res.taskFlujo
          this.myTasks = res.myTasks   
          console.log(this.myTasks)     
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
    {field: "StartDate", headerText: "Fecha Inicio"},
    { field: 'EndDate', headerText: "Fechafin"},
   
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
    resourceInfo: "resources",
    Responsable: "Responsable"
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
//ACTUALIZAR ESTADO DE LA TAREA YA SEA SI LA ACEPTO O LA RACHAZO
  actuAceptRecha(task:any, opcional:any, AcepRacha:any){
    if(opcional==0)
      task.Acepta = AcepRacha
    if(opcional==1)
      task.Rechaza = AcepRacha
    console.log(task)
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
}
