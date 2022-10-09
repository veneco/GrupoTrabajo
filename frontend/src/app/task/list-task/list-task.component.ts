import { Component, DoCheck, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TaskService } from '../../service/task.service'
import { MatSnackBar } from '@angular/material'
import { HttpErrorResponse } from '@angular/common/http'
import { Router } from '@angular/router'
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import {MatMenuModule} from '@angular/material/menu';
import {MatDialogModule, MatDialog} from '@angular/material';
import { ViewTaskComponent } from '../view-task/view-task.component';
import { compileNgModule, identifierModuleUrl, viewClassName } from '@angular/compiler';



@Component({
  selector: 'app-list-task',
  templateUrl: './list-task.component.html',
  styleUrls: ['./list-task.component.css']
})
export class ListTaskComponent implements OnInit, OnChanges {

  

  constructor(private taskService: TaskService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
    ) { }

    rol
    tasks = []
    userid
    ownerData; ownerName
    flujos = []
    datos =[]
    pruebas=[]
    status

    ngOnChanges(changes: SimpleChanges): void {
      console.log(changes);
    }
    
  ngOnInit() {
    this.rol = localStorage.user
    /*this.taskService.getTasks()
      .subscribe(
        res=>{
          this.tasks = res
          this.userid = this.tasks[0]._id
          console.log(this.userid)
        },
        err=> console.log(err)
      ),*/

      this.taskService.getFlujo()
      .subscribe(
        res=>{
          this.flujos = res
          //variable = this.flujos[0].status
          this.getAt()
          console.log(res)
        },  
        err=> console.log(err)       
      )
      
  }


  changeStatus(selectTask, status){
    const temporalStatus = selectTask.status
    selectTask.status = status
    this.taskService.editTask(selectTask)
      .subscribe(
        res=>{
          selectTask.status = status
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

  }
  delete(deleteTask){
    this.taskService.deleteTask(deleteTask)
      .subscribe(
        res=>{
          const index = this.tasks.indexOf(deleteTask)
          if(index>-1){
            this.tasks.splice(index,1)
            this.snackBar.open("Tarea Borrada", null, {
              duration: 2000
            })
          }
        },
        err=>{
          console.log(err)
          if(err instanceof HttpErrorResponse){
            if(err.status === 401){
              this.snackBar.open("No estas logeado", null, {
                duration: 2000
              })
              this.router.navigate(['/login'])
            }
          }
        }
      )
      
  }
 
  onCreate(selectTask){
    console.log(selectTask)
    this.dialog.open(ViewTaskComponent,{
      data:{
        flujos: this.flujos,
        select: selectTask
      }
    })
    
    
    //ViewTaskComponent.prototype.cargarView(selectTask)
    
    
     //console.log(selectTask._id)
      
  }

  getAt(){
    this.flujos.forEach((element, index)=> {
      this.taskService.getTasks(element)
      .subscribe(
        res=>{
          //this.tasks = res
          //this.userid = this.tasks[0]._id
          this.pruebas[index]= res
          //console.log(this.tasks)
          console.log(this.pruebas)
        },
        err=> console.log(err)
      )
    }
    );

  }

}

