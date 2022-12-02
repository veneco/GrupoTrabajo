import { DatePipe } from '@angular/common';
import { Component, OnInit, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, PipeTransform {

  loginUser = {
    correo: null,
    password: null
  }
  constructor(
    public auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar) { }

  transform(value: any, ...args: any[]) {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    let fecha = new Date()
    
    fecha.setDate(fecha.getDate() + 2);
    let datePipe: DatePipe = new DatePipe('en-US');

  }

  login(){
    this.auth.loginUser(this.loginUser)
      .subscribe(
        res => {
          localStorage.setItem('token', res.jwtToken)
          localStorage.setItem('rol', res.rol)
          localStorage.setItem('nombre', res.nombre)
          localStorage.setItem('activo', '0')
          this.router.navigate(['/tasks'])
        },
        err => this.snackBar.open("Contraseña o Usuario incorrecto", "Cerrar", {
          duration: 3000
        })
      )
  }

}
