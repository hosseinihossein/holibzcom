import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { form, FormField, maxLength, minLength, required } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatDialogContent, MatDialogActions, MatDialogClose, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
  imports: [MatDialogContent, MatFormField, MatButton, MatDialogActions, MatDialogClose, MatLabel,
    MatInput, MatError, FormField],
  selector: 'app-get-file',
  styleUrl: './get-file.css',
  templateUrl: './get-file.html',
})
export class GetFile {
  readonly dialogRef = inject(MatDialogRef<GetFile>);
  readonly data = inject<{
    fileSize?:number,
  }>(MAT_DIALOG_DATA);

  selectedFile = signal<File | null>(null);
  fileNameSrc = signal<string>('');
  fileSizeError = signal<string|null>(null);

  fileName = viewChild<ElementRef<HTMLImageElement>>("fileName");

  titleModel = signal({Title:''});
  titleForm = form(this.titleModel,
    (schemaPath)=>{
      required(schemaPath.Title,{message:'Title is required!'});
      minLength(schemaPath.Title, 3, {message: 'Title cannot be less than 3 characters!'});
      maxLength(schemaPath.Title, 60, {message: 'Title cannot be more than 60 characters!'});
    }
  );

  onSelectFile(event:Event){
    const input = event.target as HTMLInputElement;
    if (input.files && /*input.files.length > 0 &&*/ input.files[0]) {
      if(this.data.fileSize && (input.files[0].size > this.data.fileSize)){
        this.fileSizeError.set(
          `Size of the choosen file cannot be more than ${this.data.fileSize / 1024} KB!`
        );
      }
      else{
        this.selectedFile.set(input.files[0]);
        this.fileNameSrc.set(this.selectedFile()!.name);
      }
    }
    else{
      this.selectedFile.set(null);
      this.fileNameSrc.set('');
    }
  }
}
