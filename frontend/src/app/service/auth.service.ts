import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private signUpURL = "http://localhost:3003/api/user"
  private loginURL = "http://localhost:3003/api/auth"
  private rolURL = "http://localhost:3003/api/users/rol"

  constructor(private http: HttpClient,
    private router: Router) { }
    
    signUpUser(user: any){
      return this.http.post<any>(this.signUpURL, user)
    }
    loginUser(user: any){
      return this.http.post<any>(this.loginURL, user)
    }
    isLogged(){
      return !!localStorage.getItem('token')
    }
    isAdmin(){
      let rol = localStorage.getItem('rol')
      if (rol == "3" || rol == "8") 
        return true    
      else
        return false
    }
    getNombre(){
      return localStorage.getItem('nombre')
    }
    logoutUser(){
      localStorage.removeItem('token')
      localStorage.removeItem('flujo')
      localStorage.removeItem('rol')
      localStorage.removeItem('nombre')
      localStorage.removeItem('activo')
      localStorage.removeItem('flujoName')
      this.router.navigate(['/login'])
      
    }
    getToken(){
      return localStorage.getItem('token')
    }
}
