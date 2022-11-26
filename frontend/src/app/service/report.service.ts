import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ReportService {


  private reportTrask = "http://localhost:3003/api/report"

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


  getTareas(){
    const url = `${this.reportTrask}/list`
    return this.http.get<any>(url)
  }

  getFlujos(){
    const url = `${this.reportTrask}/flujos`
    return this.http.get<any>(url)
  }

  getGrupo(){
    const url = `${this.reportTrask}/grupo`
    return this.http.get<any>(url)
  }
}
