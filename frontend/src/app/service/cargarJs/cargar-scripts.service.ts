import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CargarScriptsService {

  constructor() { 
   }
   Cargar( archivos:string[])
   {
     /*for (let archivo of archivos)
     {
      let script = document.createElement("script")     
      script.src = "./js/" + archivo + ".js"
      let app_continer = document.getElementsByTagName("body")[0]
      console.log(app_continer)
      app_continer.appendChild(script)
     }*/
   }
}
