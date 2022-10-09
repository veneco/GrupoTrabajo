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

  private owner = "http://localhost:3003/api/users/list"

  private flujo = "http://localhost:3003/api/flujo/list"

  constructor(private http: HttpClient) { }

  createImageUpload(task){
    return this.http.post<any>(this.taskImageUploadUrl, task)
  }

  createTask(task){
    return this.http.post<any>(this.taskUrl, task)
  }

  editTask(task){
    return this.http.put<any>(this.taskUrl, task)
  }

  llamarUnaTarea(task){
   
    return this.http.put<any>(this.taskUna, task)
  }

  deleteTask(task){
    const _id = task._id
    const url = `${this.taskUrl}/${_id}`
    return this.http.delete<any>(url)
  }

  getTasks(status){
    return this.http.post<any>(this.listTaskUrl, status)
  }

  getOwner(){
    return this.http.get<any>(this.owner)
  }

  getFlujo(){
    return this.http.get<any>(this.flujo)
  }
}
