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

  private taskBug = "http://localhost:3003/api/problema"

  constructor(private http: HttpClient) { }

  getTokenID(){
    return localStorage.getItem('task')
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
    console.log(task)
    const url = `${this.taskUrl}/acepRecha`
    return this.http.put<any>(url, task)
  }
  getNoti(){
    const url = `${this.taskUrl}/not`
    return this.http.post<any>(url, null)
  }

  setEstadoProblema(bug:any){
    const url = `${this.taskBug}/finishProblem`
    return this.http.put<any>(url, bug)
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

  setFlujo(flujo:any){
    const url = `${this.flujoIN}/cerrar`
    return this.http.put<any>(url, {flujo})
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

  getTaskBug(){
    return this.http.get<any>(this.taskBug)
  }

  getDateTasks(id:any){

    const url = `${this.taskBug}/${id}`
    return this.http.get<any>(url)
  }

  setDateTasks(listado:any){

    const url = `${this.taskBug}/updateTask`
    return this.http.put<any>(url, listado)
  }

  getEstado(){
    const url = `${this.taskBug}/estado`
    return this.http.get<any>(url)
  }

  setReasignarTarea(task:any)
  {
    const url = `${this.taskUrl}/reasignar`
    return this.http.put<any>(url, task)
  }

  setTaskBug(bug:any){
    return this.http.post<any>(this.taskBug, bug)
  }

}
