import { Component,OnInit} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http'
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskService } from 'src/app/service/task.service';
import { CargarScriptsService } from 'src/app/service/cargarJs/cargar-scripts.service';


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
    private _CargarScripts:CargarScriptsService
    ) { 
     
    }
    ColorSemaforo:any = true
    mili = 24*60*60*1000
    datetoday:any = new Date()
    tasks:any = []
    flujosInstanciado:any = []
    datos:any =[]
    retrasado:any = 0
    notificaciones:any =[]
    rol:any = localStorage.getItem('rol')

    
  async ngOnInit() {
      this.taskService.getFlujo()
      .subscribe(
        res=>{
          let tempFlujo = res.flujo[0]
          console.log(tempFlujo)
          this.datos = res.userData
          for (let i = 0; i < tempFlujo.length; i++) {
            tempFlujo[i].FECHAINICIO = this.formatDate(tempFlujo[i].FECHAINICIO)
            this.flujosInstanciado.push(tempFlujo[i])
                       
          }          
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
  semaforo(fecha:Date)
  {
    let fecha1 = new Date(fecha)
    let fecha2 = new Date()
    let resta = fecha1.getTime() - fecha2.getTime()
    let total:any = Math.round(resta/ (1000*60*60*24))
    if(total < 0){
      this.ColorSemaforo =0
      this.retrasado++
     }
    if(total < 3 && total > 0){this.ColorSemaforo =1}
    if(total > 2){this.ColorSemaforo =2}
    return parseInt(total) 
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



