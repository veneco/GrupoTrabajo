import { Component, NgModule, OnInit } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports:[
    ComponentsModule
  ]
})
@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})


export class BoardComponent implements OnInit {

  private User: string;
  private Rol: string;
  constructor() {     
  
  this.User = localStorage.getItem('NAME');
  this.Rol = localStorage.getItem('ROL');
  }

  ngOnInit() {


  }

}
