import { Component, inject } from '@angular/core';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-confirm-delete',
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButton, MatDialogClose, MatIcon],
  templateUrl: './confirm-delete.html',
  styleUrl: './confirm-delete.css'
})
export class ConfirmDelete {
  readonly data = inject<ConfirmDeleteDataModel>(MAT_DIALOG_DATA);
}

export interface ConfirmDeleteDataModel{
  itemType:string;
  itemName?:string; 
}
export interface ConfirmDeleteResultModel{
  confirm:boolean;
}
