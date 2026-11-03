import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { IdentityService } from '../../identity/identity-service';
import { UserAccountService } from '../../user-account/user-account-service';

@Component({
  imports: [MatIconButton, MatMenuTrigger, MatIcon, NgOptimizedImage, MatTooltip],
  selector: 'app-account-dropdown',
  styleUrl: './account-dropdown.css',
  templateUrl: './account-dropdown.html',
})
export class AccountDropdown {
  menu = input.required<MatMenu>();
  identityService = inject(IdentityService);
  userAccService = inject(UserAccountService);

  //imgSrc = computed(() => this.identityService.getUserImageAddress(this.identityService.userModel()));
    
  readonly imgBtnStyle = "padding: 0px; width: 40px; height: 40px; transform: translateY(3px);"
}
