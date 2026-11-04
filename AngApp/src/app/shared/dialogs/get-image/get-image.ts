import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { form, FormField, maxLength, minLength, required } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatDialogContent, MatDialogActions, MatDialogClose, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
  imports: [MatDialogContent, MatFormField, MatButton, MatDialogActions, MatDialogClose, MatLabel,
    MatInput, MatError, FormField
  ],
  selector: 'app-get-image',
  styleUrl: './get-image.css',
  templateUrl: './get-image.html',
})
export class GetImage {
  readonly data = inject<{
    imageSize?:number,
  }>(MAT_DIALOG_DATA);
  
  selectedFile = signal<File | null>(null);
  previewImgSrc = signal<string|null>(null);
  imageSizeError = signal<string|null>(null);

  canvas = viewChild<ElementRef<HTMLCanvasElement>>("canvas");

  titleModel = signal({Title:''});
  titleForm = form(this.titleModel,
    (schemaPath)=>{
      required(schemaPath.Title,{message:'Title is required!'});
      minLength(schemaPath.Title, 3, {message: 'Title cannot be less than 3 characters!'});
      maxLength(schemaPath.Title, 60, {message: 'Title cannot be more than 60 characters!'});
    }
  );

  onSelectImage(event:Event){
    const input = event.target as HTMLInputElement;
    if (input.files && /*input.files.length > 0 &&*/ input.files[0]) {
      if(this.data.imageSize && (input.files[0].size > this.data.imageSize)){
        if(this.canvas()){
          const reader = new FileReader(); // Create a FileReader instance

          // Load the image as a Data URL
          reader.onload = (e)=> {
            const img = new Image();
            img.onload = ()=>{
              const ctx = this.canvas()!.nativeElement.getContext("2d");
              // Set new size
              const newWidth = 800;
              const newHeight = Math.round((img.height / img.width) * newWidth);

              this.canvas()!.nativeElement.width = newWidth;
              this.canvas()!.nativeElement.height = newHeight;

              // Draw resized image
              if(ctx){
                ctx.drawImage(img, 0, 0, newWidth, newHeight);
              }

              // Convert to data URL (can be uploaded or displayed)
              const resizedDataUrl = this.canvas()!.nativeElement.toDataURL("image/webp", 0.8); // 0.8 = quality only for image/jpeg and image/webp
              this.previewImgSrc.set(resizedDataUrl);
              
              this.canvas()!.nativeElement.toBlob((blob)=>{
                if(blob){
                  let file = new File([blob], "editedImage", {
                    type: blob.type || "application/octet-stream",
                    lastModified: Date.now()
                  });
                  this.selectedFile.set(file);
                }
              },"image/webp", 0.8);
            };
            img.src = e.target!.result as string;// ?? this.data.value;
          };

          reader.readAsDataURL(input.files[0]); // Read the file as a Data URL
        }
        else{
          this.imageSizeError.set(
            `Size of the choosen image cannot be more than ${this.data.imageSize / 1024} KB!`
          );
        }
      }
      else{
        this.selectedFile.set(input.files[0]);

        const reader = new FileReader(); // Create a FileReader instance

        // Load the image as a Data URL
        reader.onload = (e)=> {
          this.previewImgSrc.set(e.target!.result as string);// ?? this.data.value);
        };

        reader.readAsDataURL(input.files[0]); // Read the file as a Data URL
      }
    }
    else{
      this.selectedFile.set(null);
      this.previewImgSrc.set(null);
    }
  }
  
}
