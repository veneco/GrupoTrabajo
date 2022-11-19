import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-action-dialog',
  templateUrl: './action-dialog.component.html',
  styleUrls: ['./action-dialog.component.css']
})
export class ActionDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ActionDialogComponent>,
    @Inject(MAT_DIALOG_DATA)public data: {responsables:any, bug:any}) { }

prueba:any
  ngOnInit(): void {
    this.prueba = this.data.responsables
  }
  onClickNO():void
  {
    console.log(this.prueba)
  }
}