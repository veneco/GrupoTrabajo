import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA)public data: {message: string}) { }
    mensaje = this.data.toString().split('/')[0]
    titulo = this.data.toString().split('/')[1]
  ngOnInit(): void {
  }
  onClickNO():void
  {
    this.dialogRef.close()
  }
}
