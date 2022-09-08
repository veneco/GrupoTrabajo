import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserI } from '../../models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  roles =[
    {name: "Ejecutivo",
    valor: "Ejecutivo"},
    {name: "Ejecutivo admin",
    valor: "Ejecutivoadmin"},
    {name: "Administrador",
    valor: "Administrador"}
  ];
  tittle="Selecciono una opcion..."
  ngOnInit() {
  }

  onRegister(form): void {
    this.authService.register(form.value).subscribe(res => {
      this.router.navigateByUrl('/auth');
    });
  }

}
