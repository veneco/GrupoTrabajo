import { Component, Inject, Input, OnInit} from '@angular/core';
import { TaskService } from '../../service/task.service';
import { MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';



@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styleUrls: ['./view-task.component.css']
})
export class ViewTaskComponent implements OnInit {

  @Input() title: any;
  valor
  tasks = []
  prueba = []
  pruebas = []
  flujo = []
  tarea =[]
  id = localStorage.user;
  ownerNombre
  ownerCorreo
  userid; name; description; date; owner; status
  constructor( private taskService: TaskService,
            private router: Router,
            private snackBar: MatSnackBar,
            @Inject(MAT_DIALOG_DATA) public data) { 
              this.flujo = data.flujos
              console.log(data.flujos)
              console.log(this.flujo)
              this.tarea = data.select
              localStorage.setItem('task', data.select.id)
            }

  ngOnInit() {
    this.taskService.getOwner()
    .subscribe(
      res=>{
        console.log(res)   
        this.ownerNombre = res[0].nombre + " " + res[0].apellidop  + " " + res[0].apellidom
        this.ownerCorreo = res[0].correo
      },  
      err=> console.log(err)       
    )
  }


cargarView(datos){
  
  this.tasks = datos
  console.log(this.tasks)
  console.log(this.prueba)
  if(this.prueba[0]._id== datos._id)
  this.userid = datos._id

}
changeStatus(selectTask, status, event){
  const temporalStatus = selectTask.status
  selectTask.flujoproceso_id = status
  this.taskService.editTask(selectTask)
    .subscribe(
      res=>{
        selectTask.flujoproceso = status
        console.log(res)
      },
      err=>{
        console.log(err)
        selectTask.status = temporalStatus
        if(err instanceof HttpErrorResponse){
          if(err.status === 401){
            this.snackBar.open("No estas logeado... Enviando a Login", null, {
              duration: 2000
            })
            this.router.navigate(['/login'])
          }
        }
      }
    )
    
   // location.reload()
}
getAt(){
  this.flujo.forEach((element, index)=> {
    console.log("aca"+ element.valor + "   " + index)
    this.taskService.getTasks(element)
    .subscribe(
      res=>{
        this.pruebas[index]= res
        console.log(res)
      },
      err=> console.log(err)
    )
    
  });


}

close(){
    this.valor = true
   // location.reload()
}
}
