import { Component, inject, signal } from '@angular/core';
import { FormField, form, required, maxLength, minLength } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatDialogContent, MatDialogActions, MatDialogClose, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
  imports: [MatDialogContent, MatDialogActions, MatFormField, MatInput, MatLabel,
    MatButton, MatDialogClose, MatError, FormField],
  selector: 'app-edit-input-text',
  styleUrl: './edit-input-text.css',
  templateUrl: './edit-input-text.html',
})
export class EditInputText {
  readonly dialogRef = inject(MatDialogRef<EditInputText,EditInputTextResultModel>);
  readonly data = inject<EditInputTextDataModel>(MAT_DIALOG_DATA);

  inputModel = signal({InputValue:this.data.value ?? ''});
  inputForm = form(this.inputModel,
    (schemaPath)=>{
      required(schemaPath.InputValue, {message:`${this.data.label} is required!`});
      if(this.data.maxLength){
        maxLength(schemaPath.InputValue, this.data.maxLength, {message:`${this.data.label} cannot be more than ${this.data.maxLength} characters!`});
      }
      if(this.data.minLength){
        minLength(schemaPath.InputValue, this.data.minLength, {message:`${this.data.label} cannot be less than ${this.data.minLength} characters!`});
      }
    },
  );

}

export interface EditInputTextDataModel{
  label:string;
  value?:string; 
  maxLength?:number;
  minLength?:number;
}
export interface EditInputTextResultModel{
  value:string;
}
