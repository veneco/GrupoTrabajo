import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../service/task.service'
import { MatSnackBar } from '@angular/material'
import { HttpErrorResponse } from '@angular/common/http'
import { Router } from '@angular/router'


@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit {
  taskID
  grupo
  miembros
  usuario
  prioridad
  editTask = {
    id: null,
    nombre: null,
    descripcion: null,
    flujotarea: false,
    fechainicio: null,
    fechafin: null,
    creadapor: null,
    responsable: null,
    flujoproceso: null,
    grupotrabajo: null,
    prioridad: null,
    etiqueta: null,
    estadotarea: 1,
    finalizada: 0,
    deleted: 0
  }
  selectedFile: File = null
  
  constructor(private taskService: TaskService,
    private router: Router,
    private snackBar: MatSnackBar) { }

    ngOnInit() {
      this.taskID = this.taskService.getTokenID()
        this.taskService.getTask(this.taskID)
        .subscribe(
          res=>{
            this.editTask.id = res.id;
            this.editTask.nombre = res.nombre;
            this.editTask.descripcion = res.descripcion;
            let inicio = this.formatDate(res.fechainicio)
            this.editTask.fechainicio = new Date(inicio);
            let fin = this.formatDate(res.fechafin)
            this.editTask.fechafin = new Date(fin);
            console.log(this.editTask.fechafin)
            this.editTask.creadapor = res.creadapor;
            this.editTask.responsable = res.responsable;
            this.editTask.flujoproceso = res.flujoproceso_id;
            this.editTask.grupotrabajo = res.grupotrabajo_id;
            this.editTask.prioridad = res.prioridad_id;
            this.editTask.etiqueta = res.etiqueta_id;
            this.editTask.estadotarea = res.estadotarea_id;
            this.editTask.finalizada = res.finalizada;
            this.editTask.deleted = res.deleted;
            

            console.log(res)

          },
          err=> console.log(err)
        )
    this.taskService.getGrupo()
    .subscribe(
      res=>{
        this.miembros = res.users
        this.grupo= res.grupo
        this.miembros.forEach(element => {
          if (element.id == res.usuario.id)
          this.usuario = Array.of(element)
        });        
        console.log(res)
      },  
      err=> console.log(err)       
    ),
    this.taskService.getPrioridad()
    .subscribe(
      res=>{
        this.prioridad = res    
        console.log(this.prioridad)
      },  
      err=> console.log(err)       
    )
  }
   formatDate(date: Date): string{
    const newDate = new Date(date)
    console.log(newDate)
    const day = newDate.getDate() +2;
    const month = newDate.getMonth() +1;
    const year = newDate.getFullYear();
    console.log(`${year}-${month}-${day}`)
    return `${year}-${month}-${day}`
    
    }

//MODIFICAR UNA TAREA
  updateTask(){
    console.log(this.editTask.fechainicio)

    console.log(this.editTask.fechainicio)

     
    this.taskService.editTask(this.editTask)
      .subscribe(
        res => {
          console.log(res)
          this.router.navigate(['/tasks'])
          this.snackBar.open("Tarea modificada con Exito", null, {
            duration: 2000
          })
        },
        err => {
          console.log(err)
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
  }

  prueba(){
    console.log(this.editTask)
  }

}
