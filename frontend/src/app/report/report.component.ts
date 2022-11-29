import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { TaskService } from 'src/app/service/task.service';
import { ReportService } from '../service/report.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../components/shared/confirm-dialog/confirm-dialog.component';
import  {MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  constructor(private router: Router,
    private taskService: TaskService,
    private reportService: ReportService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar) { }



    empleados:any
    grupoTrabajo:any =[]
    tareas:any =[]
    displayedColumns: string[] = ['ID', 'NOMBRE', 'DURACION', 'AVANCE'];

    flujos:any = []
    flujoCerrado: string[] = ['ID', 'NOMBRE','RESPONSABLE', 'DURACION','ATRASO'];
    flujoEnCurso: string[] = ['ID', 'NOMBRE', 'DURACION', 'AVANCE', 'REASIGNAR'];


  ngOnInit(): void {

      this.reportService.getGrupo()
      .subscribe(
      res=>{
        let idtemporal:any = []
  
        this.empleados = res
        this.empleados.forEach( (element: any) => {
          if (!idtemporal.includes(element.GRUPOTRABAJO_ID)) {
            idtemporal.push(element.GRUPOTRABAJO_ID);
            this.grupoTrabajo.push({ID:element.GRUPOTRABAJO_ID,NOMBRE:element.NOMBREGRUPO});
          }
        });

      },  
      err=> console.log(err)       
    ),
    this.reportService.getTareas()
      .subscribe(
        res=>{
          console.log(res)
          this.tareas = res
        },  
        err=>{
          console.log(err) 
        }     
      ),
      this.reportService.getFlujos()
      .subscribe(
        res=>{
          this.flujos = res

        },  
        err=>{
          console.log(err) 
        }     
      )

   
  }
  filtrarFlujos(userID:any){
    const flujosFiltradas = this.tareas.filter((flujo: any) => flujo.IDRESPONSABLE == userID)
    let flujosunicos:any =[]
    let flujosTemp:any =[]
    flujosFiltradas.forEach( (elemento: any) => {
      if (!flujosTemp.includes(elemento.FLUJO_IN_ID)) {
        flujosTemp.push(elemento.FLUJO_IN_ID);
        flujosunicos.push(elemento);
    }
    
  }); 
    return flujosunicos.reverse()
  }
  //FILTRAR EMPLEADOS POR GRUPO DE TRABAJO
  filtrarEmpleados(grupoID:any){
    const empleadosFiltrados = this.empleados.filter((empleado: any) => empleado.GRUPOTRABAJO_ID == grupoID)
    return empleadosFiltrados
  }
//FILTRAR FLUJOS POR GRUPO DE TRABAJO
  filtrarFlujosGrupo(grupoID:any, finalizado:String){
    const flujosFiltrados = this.flujos.filter((flujo: any) => flujo.GRUPOTRABAJO_ID == grupoID && flujo.DELETED == finalizado)
    return flujosFiltrados.reverse()
  }

  //FILTRAR FLUJOS POR GRUPO DE TRABAJO
  filtrarTareasGrupo(flujoID:any){
    const tareaFiltradas = this.tareas.filter((tarea: any) => tarea.FLUJO_IN_ID == flujoID)

    return tareaFiltradas
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

  reasignar(tarea:any){
    const dialogReasignar = this.dialog.open(ConfirmDialogComponent,{
      width:'350px',
      data:'Seguro que desea reasignar esta tarea?'
    });
    dialogReasignar.afterClosed().subscribe(
      res=>{ 
        if(res==undefined){
          
          this.snackBar.open("No se envio la reasignacion de la tarea", "Cerrar", {
            duration: 3000
          }) 
        }else{

         // ACTUALIZAR DETALLESTAREA
         let Comentario = "Reasignado por " + localStorage.getItem('nombre') + " a través de los reportes"
         let task={TaskID: tarea.ID, Acepta:1, Rechaza:1}
         this.taskService.setTaskEstado({task,Comentario})
          .subscribe(
            res=>{ 
            },  
            err=>{
              console.log(err) 
            }     
          )
        }
      });
  }


}
