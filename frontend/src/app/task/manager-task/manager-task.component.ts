import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { TaskService } from 'src/app/service/task.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-manager-task',
  templateUrl: './manager-task.component.html',
  styleUrls: ['./manager-task.component.css']
})
export class ManagerTaskComponent implements OnInit {

  constructor(private router: Router,
    private taskService: TaskService,
    private snackBar: MatSnackBar) { }
    responsable:any
    flujosRechazadas:any = []
    tareasRechazadas:any = []
    displayedColumns: string[] = ['flujoID', 'Nombre', 'Rechazo Tarea', 'Nuevo Responsable', 'Guardar'];
  dataSource:any = []
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
      
    this.taskService.getGrupo()
    .subscribe(
      res=>{
        this.responsable = res
        console.log(res)
        console.log(this.tareasRechazadas)
      },  
      err=> console.log(err)       
    )

   
  }
  filtrarTarea(index:any){

    const tareasFiltradas = this.tareasRechazadas.filter((tarea: any) => tarea.flujoID == index)
    return tareasFiltradas
  }
  asignarResponsable(i:any, responsable:any){

    let index = this.tareasRechazadas.indexOf(i);
    this.tareasRechazadas[index].usuarioID= responsable
    this.tareasRechazadas[index].Reasignado= 1
   
  }
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
      console.log(" no reasignado tarea")
    this.snackBar.open("No se le ha asignado responsable a la tarea "+ tarea.taskName, "Cerrar", {
      duration: 2000
    })
    }
    
  }

}
