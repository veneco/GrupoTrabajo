import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TaskService } from '../../service/task.service'
import { MatSnackBar } from '@angular/material'
import { HttpErrorResponse } from '@angular/common/http'
import { Router } from '@angular/router'


@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent implements OnInit {

  grupo
  miembros
  usuario
  prioridad
  createTask = {
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

  createUploadImage(){
    const fd = new FormData()
    fd.append('image', this.selectedFile, this.selectedFile.name)
    fd.append('name', this.createTask.nombre)
    fd.append('description', this.createTask.descripcion)
    this.taskService.createImageUpload(fd)
      .subscribe(
        res=>{
          this.router.navigate(['/tasks'])
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

    console.log(this.createTask)
  }

  formatDate(date: Date): string{
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    return `${year}-${month}-${day}`

  }
//CREAR UNA TAREA
  create(){
    let inicio = new Date(this.createTask.fechainicio)
    let fin = new Date(this.createTask.fechafin)
    this.createTask.fechainicio = this.formatDate(inicio)
    this.createTask.fechafin = this.formatDate(fin)

    this.taskService.createTask(this.createTask)
      .subscribe(
        res => {
          console.log(res)
          this.router.navigate(['/tasks'])
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

}
