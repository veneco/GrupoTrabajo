import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  User;
  constructor() {     
  
  this.User = localStorage.getItem('EXPIRES_IN');
  }

  ngOnInit() {


  }

}
