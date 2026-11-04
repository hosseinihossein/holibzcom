import { Component, inject, signal } from '@angular/core';
import { form, FormField, maxLength, minLength, required } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-edit-textarea',
  imports: [MatDialogContent, MatLabel, MatFormField, MatDialogActions, MatDialogClose, MatButton, 
    MatInput, MatError, FormField,],
  templateUrl: './edit-textarea.html',
  styleUrl: './edit-textarea.css'
})
export class EditTextarea {
  //readonly dialogRef = inject(MatDialogRef<EditTextarea>);
  readonly data = inject<{
    label:string, 
    value:string,
    maxLength?:number, 
    minLength?:number,
  }>(MAT_DIALOG_DATA);

  inputModel = signal({TextValue:this.data.value});
  inputForm = form(this.inputModel,
    (schemaPath)=>{
      required(schemaPath.TextValue, {message:`${this.data.label} is required!`});
      if(this.data.maxLength){
        maxLength(schemaPath.TextValue, this.data.maxLength, {message:`${this.data.label} cannot be more than ${this.data.maxLength} characters!`});
      }
      if(this.data.minLength){
        minLength(schemaPath.TextValue, this.data.minLength, {message:`${this.data.label} cannot be less than ${this.data.minLength} characters!`});
      }
    },
  );

  /*myText = new FormControl(this.data.value,{
    nonNullable:true,
    validators:[Validators.required, Validators.maxLength(4000)],
  });

  isPersian = signal(this.data.persian ?? false);

  togglePersian(){
    this.isPersian.update(p=>!p);
  }*/
}
