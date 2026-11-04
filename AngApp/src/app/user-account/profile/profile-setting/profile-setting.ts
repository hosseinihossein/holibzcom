import { NgOptimizedImage } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatFabButton, MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { WaitSpinner } from '../../../shared/wait-spinner/wait-spinner';
import { MatDialog } from '@angular/material/dialog';
import { httpResource } from '@angular/common/http';
import { IdentityService } from '../../../identity/identity-service';

@Component({
  imports: [MatCardModule,MatIcon,MatIconButton,MatTooltip,NgOptimizedImage,WaitSpinner],
  selector: 'app-profile-setting',
  styleUrl: './profile-setting.css',
  templateUrl: './profile-setting.html',
})
export class ProfileSetting {
  identityService = inject(IdentityService);
  dialog = inject(MatDialog);
  
  displayWaitSpinner = signal(false);

  afToken = httpResource(()=>
    this.identityService.myIdentityInfo() ?
    "/api/identity/GetAntiForgeryToken" :
    undefined
  );
  
}
