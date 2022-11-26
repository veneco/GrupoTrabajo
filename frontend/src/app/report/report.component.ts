import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { TaskService } from 'src/app/service/task.service';
import { ReportService } from '../service/report.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  constructor(private router: Router,
    private taskService: TaskService,
    private reportService: ReportService,
    private snackBar: MatSnackBar) { }



    empleados:any
    grupoTrabajo:any =[]
    tareas:any =[]
    displayedColumns: string[] = ['ID', 'NOMBRE', 'DURACION', 'AVANCE'];

    flujos:any = []
    bugColumns: string[] = ['BugID','FlujoID', 'TaskID','TaskName', 'CreadoPor', 'BugComentario','Accion', 'Resolver'];


  ngOnInit(): void {

      this.reportService.getGrupo()
      .subscribe(
      res=>{
        this.empleados = res
        this.empleados.forEach( (elemento: any) => {
          if (!this.grupoTrabajo.includes(elemento.GRUPOTRABAJO_ID)) {
            this.grupoTrabajo.push(elemento.GRUPOTRABAJO_ID);
          }
        });
        console.log(this.empleados)
      },  
      err=> console.log(err)       
    ),
    this.reportService.getTareas()
      .subscribe(
        res=>{
          this.tareas = res
          console.log(res)
        },  
        err=>{
          console.log(err) 
        }     
      ),
      this.reportService.getFlujos()
      .subscribe(
        res=>{
          this.flujos = res
          console.log(res)
        },  
        err=>{
          console.log(err) 
        }     
      )

   
  }
  filtrarFlujos(userID:any){
    const flujosFiltradas = this.tareas.filter((flujo: any) => flujo.IDRESPONSABLE == userID)
    let flujosunicos:any =[]
    flujosFiltradas.forEach( (elemento: any) => {
      if (!flujosunicos.includes(elemento.FLUJO_IN_ID)) {
        flujosunicos.push(elemento.FLUJO_IN_ID);
    }
    
  }); 
    return flujosunicos
  }
  //FILTRAR EMPLEADOS POR GRUPO DE TRABAJO
  filtrarEmpleados(grupoID:any){
    const empleadosFiltrados = this.empleados.filter((empleado: any) => empleado.GRUPOTRABAJO_ID == grupoID)
    return empleadosFiltrados
  }
//FILTRAR FLUJOS POR GRUPO DE TRABAJO
  filtrarFlujosGrupo(grupoID:any, finalizado:String){
    const empleadosFiltrados = this.flujos.filter((flujo: any) => flujo.GRUPOTRABAJO_ID == grupoID && flujo.DELETED == finalizado)
    return empleadosFiltrados
  }

  //FILTRAR FLUJOS POR GRUPO DE TRABAJO
  filtrarTareasGrupo(flujoID:any){
    const flujosFiltradas = this.tareas.filter((tarea: any) => tarea.FLUJO_IN_ID == flujoID)
   // console.log(flujosFiltradas)
    return flujosFiltradas
  }

  

  //FILTRAR LAS TAREAS PARA QUE SE VEAN EN LA VISTA
  filtrarTarea(flujoID:any, userID:any){

    const tareasFiltradas = this.tareas.filter((tarea: any) => tarea.FLUJO_IN_ID == flujoID && tarea.IDRESPONSABLE == userID)
    return tareasFiltradas
  }

//CALCULAR CARGA DE TRABAJO
  calcularCarga(userID:any){
    let carga:any = 0
    const tareasFiltradas = this.tareas.filter((tarea: any) => tarea.IDRESPONSABLE == userID)
    tareasFiltradas.forEach((element:any) => {
      carga = carga + element.DURACION
    });
    return carga
  }

  //CALCULAR AVANCE DEL FLUJO
  calcularAvance(flujoID:any){
    let carga:any = 0
    const flujoFiltradas = this.tareas.filter((flujo: any) => flujo.FLUJO_IN_ID == flujoID)
    flujoFiltradas.forEach((element:any) => {
      carga = carga + element.AVANCE
    });
    carga = Math.round(carga / flujoFiltradas.length)
    return carga
  }



}
