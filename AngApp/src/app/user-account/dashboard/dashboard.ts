import { Component, input } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  imports: [MatTabsModule,],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {
  userId = input.required<string>();
  
}
