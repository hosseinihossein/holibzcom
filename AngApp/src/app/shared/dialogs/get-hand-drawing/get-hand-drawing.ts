import { AfterViewInit, Component, DOCUMENT, ElementRef, inject, signal, viewChild } from '@angular/core';
import { MatButton, MatFabButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatDialogContent, MatDialogActions, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';

@Component({
  imports: [MatDialogContent, MatDialogActions, MatButton, MatDialogClose, MatSlider, MatCard,
    MatCardContent, MatIcon, MatSliderThumb, MatFabButton],
  selector: 'app-get-hand-drawing',
  styleUrl: './get-hand-drawing.css',
  templateUrl: './get-hand-drawing.html',
})
export class GetHandDrawing implements AfterViewInit {
  readonly dialogRef = inject(MatDialogRef<GetHandDrawing>);
  window = inject(DOCUMENT).defaultView!;

  dialogContent = viewChild.required(MatDialogContent,{read:ElementRef<Element>});
  canvasPointer = viewChild.required<ElementRef<HTMLDivElement>>("pointerDiv");
  myCanvas = viewChild.required<ElementRef<HTMLCanvasElement>>("myCanvas");
  ctx = signal<CanvasRenderingContext2D|null>(null);
  
  // State
  isDrawing = signal(false);
  drawMode = signal<"draw"|"erase">("draw");
  
  // last smoothed point
  smoothX = signal(0);
  smoothY = signal(0);

  // Set default brush size
  brushSize = signal(2);
  
  //drawing image file
  imageFile = signal<File|null>(null);

  constructor(){}
  ngAfterViewInit(): void {
    this.myCanvas().nativeElement.width = Math.floor(this.window.innerWidth * 7 / 10);
    this.myCanvas().nativeElement.height = Math.floor(this.window.innerHeight * 6 / 10);
    
    this.ctx.set(this.myCanvas().nativeElement.getContext('2d'));
    if(this.ctx()){
      //this.ctx()!.lineWidth = this.brushSize();
      this.ctx()!.lineCap = "round";
      this.ctx()!.lineJoin = "round";
      this.ctx()!.strokeStyle = "#333";
    }
  }

  // Button handlers
  toggleDraw() {
    if(this.drawMode() === "draw"){
      this.drawMode.set("erase");
      this.setBrushSize(10);
    }
    else{
      this.drawMode.set("draw");
      this.setBrushSize(2);
    }
  }
  clearCanvas() {
    this.ctx()?.reset();
  }
  setBrushSize(size:number){
    this.brushSize.set(size <= 0 ? 1 : size);
    //console.log(this.brushSize());
  }

  // Pointer position helper
  getPos(evt:PointerEvent) {
    const rect = this.myCanvas().nativeElement.getBoundingClientRect();
    const clientX = evt.clientX;
    const clientY = evt.clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
      cx: clientX -  rect.left + this.myCanvas().nativeElement.offsetLeft,
      cy: clientY -  rect.top + this.myCanvas().nativeElement.offsetTop
    };
  }

  start(evt:PointerEvent) {
    evt.preventDefault();
    this.isDrawing.set(true);

    this.canvasPointer().nativeElement.style.visibility = "visible";

    const pos = this.getPos(evt);

    // Initialize smoothed coords
    this.smoothX.set(pos.x);
    this.smoothY.set(pos.y);

    //pointer location
    this.canvasPointer().nativeElement.style.left = (pos.cx) + "px";
    this.canvasPointer().nativeElement.style.top = (pos.cy) + "px";
    //pointer brush size
    this.canvasPointer().nativeElement.style.width = this.brushSize() + "px";
    this.canvasPointer().nativeElement.style.height = this.brushSize() + "px";

    // Set draw or erase behavior
    if (this.drawMode() === "draw") {
      if(this.ctx()){
        this.ctx()!.globalCompositeOperation = "source-over";
        this.ctx()!.strokeStyle = "#333";
        this.ctx()!.lineWidth = this.brushSize();
      }
    } else {
      if(this.ctx()){
        this.ctx()!.globalCompositeOperation = "destination-out";  // real erase technique
        this.ctx()!.strokeStyle = "rgba(0,0,0,1)";
        this.ctx()!.lineWidth = this.brushSize();
      }
    }

    this.ctx()?.beginPath();
    this.ctx()?.moveTo(pos.x, pos.y);
  }

  stop(evt:PointerEvent) {
    evt.preventDefault();
    this.isDrawing.set(false);
    this.canvasPointer().nativeElement.style.visibility = "hidden";
    this.ctx()?.beginPath();
  }

  draw(evt:PointerEvent) {
    if (!this.isDrawing()) return;
    evt.preventDefault();

    const pos = this.getPos(evt);

    // Smooth the movement:
    this.smoothX.set(this.smoothX() + (pos.x - this.smoothX()) * 0.50);//smoothing
    this.smoothY.set(this.smoothY() + (pos.y - this.smoothY()) * 0.50);//smoothing

    this.canvasPointer().nativeElement.style.left = (pos.cx) + "px";
    this.canvasPointer().nativeElement.style.top = (pos.cy) + "px";

    // Draw a quadratic curve toward the smoothed point
    this.ctx()?.quadraticCurveTo(this.smoothX(), this.smoothY(), this.smoothX(), this.smoothY()); // valid Canvas API [cite:2,4]
    this.ctx()?.stroke();
  }

  erase(evt:PointerEvent){
    if (!this.isDrawing()) return;
    evt.preventDefault();

    const pos = this.getPos(evt);

    this.canvasPointer().nativeElement.style.left = (pos.cx) + "px";
    this.canvasPointer().nativeElement.style.top = (pos.cy) + "px";

    this.ctx()?.lineTo(pos.x, pos.y);
    this.ctx()?.stroke();
  }

  onPointerLeave(evt:PointerEvent){
    this.canvasPointer().nativeElement.style.visibility = "hidden";
    this.isDrawing.set(false);
  }

  onSubmitImage(){
    if(this.myCanvas()){
      this.myCanvas().nativeElement.toBlob((blob)=>{
        if(blob){
          let file = new File([blob], "freeHandDraw.webp", {
            type: blob.type || "application/octet-stream",
            lastModified: Date.now()
          });
          this.imageFile.set(file);
          if(this.imageFile()){
            this.dialogRef.close({file:this.imageFile()});
          }
        }
      },"image/webp");
    }
  }

}
