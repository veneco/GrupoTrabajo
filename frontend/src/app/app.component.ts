import { Component } from '@angular/core';
import { CargarScriptsService } from 'src/app/service/cargarJs/cargar-scripts.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';

  constructor(
    private _CargarScripts:CargarScriptsService
    ) { 
      this._CargarScripts.Cargar(["style"])   
    }
}
