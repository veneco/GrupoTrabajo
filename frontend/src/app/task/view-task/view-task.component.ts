import { Component, DoCheck, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TaskService } from '../../service/task.service';
import { MatDialog, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';



@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styleUrls: ['./view-task.component.css']
})
export class ViewTaskComponent implements OnInit, OnChanges {

  @Input() title: any;
  
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
              this.tarea = data.select

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
  ngOnChanges(event: SimpleChanges): void {
  console.log(event)

  }

cargarView(datos){
  
  this.tasks = datos
  console.log(this.tasks)
  console.log(this.prueba)
  if(this.prueba[0]._id== datos._id)
  this.userid = datos._id

}
changeStatus(selectTask, status, event){
  //console.log(event)
  const temporalStatus = selectTask.status
  selectTask.status = status
  this.taskService.editTask(selectTask)
    .subscribe(
      res=>{
        selectTask.status = status
        console.log(res)
        this.router.navigate(['/tasks'])
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
    location.reload()
    
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
}
