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
  nameTask = localStorage.getItem('flujoName')
  public data: any[] = [];
  public myTasks:any = [];
  public timezoneValue: string = 'UTC';
  public dayWorkingTime: object[]  = [{ from: 0, to: 24 }];
  temp:any[] = []
  prueba:boolean = true
  avance:any
  total:any
  ColorSemaforo:any
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
  
    this.taskService.setTask(task)
      .subscribe(
        res=>{ 
  
          location.reload();
        },  
        err=>{
          console.log(err) 
        }     
      )
  }
  //FINALIZAR TAREA
  finalizar(task:any)
  {
    task.Atraso = this.semaforo(task.FechaFin)
    task.Finalizada = "1"
    this.taskService.setTask(task)
    .subscribe(
      res=>{ 

        location.reload();
      },  
      err=>{
        console.log(err) 
      }     
    )
  }

//CERRAR FLUJO INSTANCIADO
activarSlider(valor:any)
{
  let activar = false;
  if(valor== "1")
    activar = true;
  return activar
}

//CERRAR EL FLUJO POR COMPLETO Y VOLVER LAS TAREAS FINALIZADAS
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

        },  
        err=>{
          console.log(err) 
        }     
      )
  }

  semaforo(fecha:Date, final:any=0)
  {
    let fecha1 = new Date(fecha)
    let fecha2 = new Date()
    let resta = fecha1.getTime() - fecha2.getTime()
    this.total = Math.round(resta/ (1000*60*60*24))
    if(this.total < 0){this.ColorSemaforo =0}
    if(this.total < 8 && this.total > -1){this.ColorSemaforo =1}
    if(this.total > 7){this.ColorSemaforo =2}
    return parseInt(this.total) 
  }

  openDialogCerrarFlujo():void{
    const dialogRef = this.dialog.open(ConfirmDialogComponent,{
      width:'350px',
      data:'Seguro que desea terminar el flujo?/Terminar Flujo'
    });
    dialogRef.afterClosed().subscribe(
      res=>{ 
        if(res){
          this.cerrarFlujo()
        }
      });
  }

  openDialogForzarCierre():void{
    const dialogRef = this.dialog.open(ConfirmDialogComponent,{
      width:'350px',
      data:'Seguro que desea forzar el cierre del flujo?/Forzar Cierre'
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
      data:'Seguro que desea rechazar la tarea?/Escribir mensaje'
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
      data:'Que error se presento en la tarea?/Reportar problema'
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

