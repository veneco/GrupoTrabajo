import { Component,OnInit} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http'
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskService } from 'src/app/service/task.service';
import { CargarScriptsService } from 'src/app/service/cargarJs/cargar-scripts.service';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-list-task',
  templateUrl: './list-task.component.html',
  styleUrls: ['./list-task.component.css']
})
export class ListTaskComponent implements OnInit {

//@ViewChild('asStyle')  estilo: ElementRef;

  constructor(private taskService: TaskService,
    private snackBar: MatSnackBar,
    private router: Router,
    private _CargarScripts:CargarScriptsService,
    public authService: AuthService
    ) { 
     
    }
    ColorSemaforo:any = true
    datetoday:any = new Date()
    tasks:any = []
    flujosInstanciado:any = []
    datos:any =[]
    retrasado:any = 0
    notificaciones:any =[]
    total:any
    rol:any = localStorage.getItem('rol')

    
  async ngOnInit() {
      this.taskService.getFlujo()
      .subscribe(
        res=>{
          let tempFlujo = res.flujo[0]
          
          this.datos = res.userData
          for (let i = 0; i < tempFlujo.length; i++) {
            tempFlujo[i].FECHAFIN = this.formatDate(tempFlujo[i].FECHAFIN)
            tempFlujo[i].FECHAINICIO = this.formatDate(tempFlujo[i].FECHAINICIO)
            this.flujosInstanciado.push(tempFlujo[i])
                       
          }
          console.log(this.flujosInstanciado)          
        },  
        err=>{
          console.log(err) 
        }     
      ),
      this.taskService.getNoti()
      .subscribe(
        res=>{
          this.notificaciones = res 
        },  
        err=>{
          console.log(err) 
        }     
      )
      this.datetoday =  this.datetoday.getDate() + "-"
      +(this.datetoday.getMonth()+1) + "-"
      +this.datetoday.getFullYear()
  }

  viewFlujo(data:any){
    localStorage.setItem('flujo', data.ID)
    this.router.navigate(['/view'])
  }
  formatDate(date: any): string{   
    let fecha = new Date(date);
    return fecha.toISOString().split('T')[0]

  }

  //COLOR Y CALCULO DE NUMERO DEL SEMAFORO
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

  //CALCULO DE LA BARRA DE AVANCE POR FECHA
  avancePorFecha(flujo:any)
  { 
    let fechaInit = new Date(flujo.FECHAINICIO)
    let fechaFin = new Date(flujo.FECHAFIN)
    let fechaHoy = new Date()
    let diasTotalMili = fechaFin.getTime() - fechaInit.getTime()
    let diasAvanceMili = fechaHoy.getTime() - fechaInit.getTime() 
    let diasTotal = Math.round(diasTotalMili/ (1000*60*60*24))
    let diasAvance = Math.round(diasAvanceMili/ (1000*60*60*24))
    let totalAvance = Math.round((diasAvance * 100 )/ diasTotal)
    //console.log(flujo.ID+" "+ diasTotal + " " + diasAvance +" "+ totalAvance)
    return totalAvance
  }
  delete(deleteTask:any){
    this.taskService.deleteTask(deleteTask)
      .subscribe(
        res=>{
          const index = this.tasks.indexOf(deleteTask)
          if(index>-1){
            this.tasks.splice(index,1)
            this.snackBar.open("Tarea Borrada", "", {
              duration: 2000
            })
          }
        },
        err=>{
          console.log(err)
          if(err instanceof HttpErrorResponse){
            if(err.status === 401){
              this.snackBar.open("No estas logeado", "", {
                duration: 2000
              })
              this.router.navigate(['/login'])
            }
          }
        }
      )
      
  }      
}



