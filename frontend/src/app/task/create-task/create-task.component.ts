import { Component, OnInit} from '@angular/core';
import { TaskService } from '../../service/task.service'
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as _moment from 'moment'
import { HttpErrorResponse } from '@angular/common/http'
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material/snack-bar';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { DatePipe } from '@angular/common';

const moment =  _moment;
@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
  styleUrls: ['./create-task.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
],

})
export class CreateTaskComponent implements OnInit {

  flujo:any
  responsable:any 
  miembros:any
  usuario:any =[]
  tarea:any
  dataSources = []
  createTask = {
    nombre: null,
    descripcion: null,
    fechainicio: null,
    responsable: null,
    finalizada: 0,
    deleted: 0
  }

  //displayedColumns: string[] = ['Orden', 'Nombre', 'Descripcion', 'Responsable'];

  dataSource:any = []
  columnsToDisplay = ['ORDEN','NOMBRE','SUBTAREA','DURACION'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement!: null;

  constructor(private taskService: TaskService,
    private router: Router,
    private snackBar: MatSnackBar) { }

    ngOnInit() {
    this.taskService.getFlujoPL()
    .subscribe(
      res=>{
        this.flujo = res.flujo[0]
        this.tarea = res.tarea

       
      },  
      err=> console.log(err)       
    ),
    this.taskService.getGrupo()
    .subscribe(
      res=>{
        this.responsable = res
      
      },  
      err=> console.log(err)       
    )

  }
 prueba(flujo:any, index:any ){
    //console.log(this.tarea[index])
    this.dataSource = this.tarea[index]
    this.snackBar.open(flujo.DESCRIPCION, "Cerrar", {
      duration: 20000
    })
  }
  asignarTarea(tarea:any, i:any){   
    this.usuario[i]= tarea
  }

  formatDate(date: string, duracion = 0){
    
    let fecha = new Date(date) 
    fecha.setDate(fecha.getDate() + duracion);
    let datePipe: DatePipe = new DatePipe('en-US');
    return fecha.toISOString().substring(0, fecha.toISOString().length - 1)
    

  }
//CREAR UNA FLUJO
  create(){
    //console.log(this.createTask, this.dataSource)       
    this.taskService.createFlujo(this.createTask)
      .subscribe(
        res => {
          console.log(res)
          this.createTarea(res.ID)
        },
        err => {
          console.log(err)
        },
      )
      
  }



  createTarea(idTarea:any){ 
    let fechainicial:any = this.createTask.fechainicio
    let listado: any[]=[]
    let fechaInicio: any[]=[]
    let fechaFin: any[]=[]
    let ultimaPredecedora:any
    let duracionTotal:any
    
      Object.keys(this.dataSource).forEach((key, index)=>{
        const tarea = this.dataSource[key]       
        if(tarea.DE_SUBTAREA != 0)
        {          
          if(tarea.PREDECEDORA == ultimaPredecedora+1){
            let fechatemporalInit= this.formatDate(fechaInicio[ultimaPredecedora])
            fechaInicio.push(fechatemporalInit)
            
            if(tarea.DURACION == duracionTotal){  
              duracionTotal = tarea.DURACION
              let fechatemporalFin= this.formatDate(fechaInicio[ultimaPredecedora],duracionTotal)
              fechaFin[ultimaPredecedora]=fechatemporalFin
              let fechatemporalfinsub= this.formatDate(fechaInicio[ultimaPredecedora],duracionTotal)
              fechaFin[index]=fechatemporalfinsub
            }            
            else{
              duracionTotal = duracionTotal+ tarea.DURACION
              let fechatemporalFin= this.formatDate(fechaInicio[ultimaPredecedora],duracionTotal)
              fechaFin[ultimaPredecedora]=fechatemporalFin
              let fechatemporalfinsub= this.formatDate(fechaInicio[ultimaPredecedora],duracionTotal)
              fechaFin[index]=fechatemporalfinsub   
            }
             
          }
          else{
            let fechatemporalInit= this.formatDate(fechaInicio[index-1],tarea.DURACION)
            fechaInicio.push(fechatemporalInit)
            let fechatemporalfinsub= this.formatDate(fechaInicio[index],tarea.DURACION)
            fechaFin.push(fechatemporalfinsub)           
          }        
        }
        else{  
          if (index == 0){
            let fechatemporal= this.formatDate(fechainicial)
            fechaInicio.push(fechatemporal) 
          }
          else{
            let fechatemporal= this.formatDate(fechaFin[index-1])
            fechaInicio.push(fechatemporal)
          }
          ultimaPredecedora = tarea.PREDECEDORA
            duracionTotal = 0
            
            if(tarea.SUBTAREA == 1)
            {
              let fechatemporal= '2000-10-10'
              fechaFin.push(fechatemporal)
            }        
            else{
              let fechatemporal= this.formatDate(fechaInicio[index],tarea.DURACION)
              fechaFin.push(fechatemporal)
            }
        }
        listado.push({TAREA:tarea , RESPONSABLE:this.usuario[index], FECHAINICIO:fechaInicio[index], FECHAFIN:fechaFin[index]})
        
      })
      for (let index = 0; index < fechaFin.length; index++) {
        listado[index].FECHAFIN = fechaFin[index]
        
      }
      console.log(listado[0].FECHAFIN)

    this.taskService.createTask(listado, idTarea, this.usuario)
      .subscribe(
        res => {
          console.log(res)
          this.router.navigate(['/tasks'])
        },
        err => {
          console.log(err)
        }
        

      )
  }
}
