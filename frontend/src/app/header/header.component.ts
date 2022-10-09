import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userData

  constructor(private authService: AuthService) { }
  
  ngOnInit() {
    
    this.authService.getRol()
    .subscribe(
      res=>{
        this.userData = res.rol

        console.log(this.userData)
      },  
      err=> console.log(err)       
    )
  }

  roladmin(){
    if(this.userData == 1) 
    return true
    else return false
  
  }
}
