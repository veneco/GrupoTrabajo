import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class TaskService {


  private listTaskUrl = "http://localhost:3003/api/task/list"

  private taskUrl = "http://localhost:3003/api/task"

  private taskUna = "http://localhost:3003/api/task/listTask"

  private taskImageUploadUrl = "http://localhost:3003/api/task/upload"

  private grupo = "http://localhost:3003/api/users/grupo"

  private flujo = "http://localhost:3003/api/flujo/list"

  private flujoPL = "http://localhost:3003/api/flujo/flujoPL"

  private flujoIN = "http://localhost:3003/api/flujo/"

  private tareaPL = "http://localhost:3003/api/task/taskPL"

  private taskView = "http://localhost:3003/api/task/list"

  constructor(private http: HttpClient) { }

  getTokenID(){
    return localStorage.getItem('task')
  }

  createImageUpload(task:any){
    return this.http.post<any>(this.taskImageUploadUrl, task)
  }

  createFlujo(flujo:any){

    return this.http.post<any>(this.flujoIN, flujo)
  }

  createTask(task:any, id:any, responsable:any){
    const url = `${this.taskUrl}/${id}`
    return this.http.post<any>(url, task)
  }

  setTask(task:any){
    return this.http.put<any>(this.taskUrl, task)
  }
  setTaskEstado(task:any){
    const url = `${this.taskUrl}/acepRecha`
    return this.http.put<any>(url, task)
  }
  getNoti(){
    const url = `${this.taskUrl}/not`
    return this.http.post<any>(url, null)
  }

  deleteTask(task:any){
    const _id = task._id
    const url = `${this.taskUrl}/${_id}`
    return this.http.delete<any>(url)
  }

  getTasks(status:any){
    return this.http.post<any>(this.listTaskUrl, status)
  }


  getTask(taskID:any){
    const id = taskID
    const url = `${this.taskUrl}/${id}`
    return this.http.get<any>(url)
  }

  getGrupo(){
    return this.http.get<any>(this.grupo)
  }

  getFlujo(){
    return this.http.get<any>(this.flujo)
  }

  getFlujoPL(){
    return this.http.get<any>(this.flujoPL)
  }

  getTareaPL(){
    return this.http.get<any>(this.tareaPL)
  }
  setReasignarTarea(task:any)
  {
    const url = `${this.taskUrl}/reasignar`
    return this.http.put<any>(url, task)
  }

}
