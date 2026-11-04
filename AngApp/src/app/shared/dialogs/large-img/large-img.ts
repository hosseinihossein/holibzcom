import { NgOptimizedImage } from '@angular/common';
import { AfterViewInit, Component, DOCUMENT, ElementRef, inject, signal, viewChild } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef, MatDialogClose } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-large-img',
  imports: [MatDialogContent, NgOptimizedImage, MatIcon, MatIconButton, MatTooltip, MatDialogClose],
  templateUrl: './large-img.html',
  styleUrl: './large-img.css'
})
export class LargeImg implements AfterViewInit {
  //readonly dialogRef = inject(MatDialogRef<LargeImg>);
  readonly data = inject<{
    imgSrc: string, 
    imgTitle?: string
  }>(MAT_DIALOG_DATA);
  
  theImage = viewChild<ElementRef<HTMLImageElement>>("theImage");
  windowService = inject(DOCUMENT).defaultView!;

  fitTo90 = signal(false);
  cursorZoomIn = signal(false);
  
  ngAfterViewInit(): void {
    if(this.theImage()){
      this.theImage()!.nativeElement.addEventListener("click", ()=>{
        this.fitTo90.update(f=>!f);
        this.cursorZoomIn.update(z=>!z);
      });
      
      let windowWidth90 = Math.floor(this.windowService.innerWidth * 90 / 100);
      if(this.theImage()!.nativeElement.offsetWidth < windowWidth90){
        this.cursorZoomIn.set(true);
      }
      else if(this.theImage()!.nativeElement.offsetWidth > windowWidth90){
        this.cursorZoomIn.set(false);
      }
    }
  }

}
