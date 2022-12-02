import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.css']
})
export class ErrorDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA)public data: {message: string}) { }
  comentario:string =""
  mensaje = this.data.toString().split('/')[0]
  titulo = this.data.toString().split('/')[1]
  opcion:any = this.data.toString().split('/')[2]
  ngOnInit(): void {
  }
  onClickNO():void
  {
    this.dialogRef.close()
  }
}
