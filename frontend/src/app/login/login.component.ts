import { DatePipe } from '@angular/common';
import { Component, OnInit, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';


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
  constructor(public auth: AuthService,
    private router: Router) { }

  transform(value: any, ...args: any[]) {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    let fecha = new Date()
    
    fecha.setDate(fecha.getDate() + 2);
    let datePipe: DatePipe = new DatePipe('en-US');
    console.log(fecha.toISOString().substring(0, fecha.toISOString().length - 1));
  }

  login(){
    this.auth.loginUser(this.loginUser)
      .subscribe(
        res => {
          localStorage.setItem('token', res.jwtToken)
          localStorage.setItem('rol', res.rol)
          localStorage.setItem('nombre', res.nombre)
          this.router.navigate(['/tasks'])
        },
        err => console.log(err)
      )
  }

}
