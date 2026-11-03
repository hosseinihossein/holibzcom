import { afterNextRender, Component, computed, DOCUMENT, HostListener, inject, injectAsync, onIdle, Signal, signal } from '@angular/core';
import { SharedConfigs } from '../shared/services/shared-configs';
import { NgOptimizedImage } from '@angular/common';
import { MatIconButton, MatFabButton, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatToolbar } from '@angular/material/toolbar';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { AccountDropdown } from './account-dropdown/account-dropdown';
import { IdentityService } from '../identity/identity-service';

@Component({
  imports: [MatIcon, MatToolbar, MatIconButton, MatMenu, MatMenuItem, AccountDropdown, MatTooltip,
    RouterLink, NgOptimizedImage, MatButton],
  selector: 'app-nav-bar',
  styleUrl: './nav-bar.css',
  templateUrl: './nav-bar.html',
})
export class NavBar {
  readonly sharedConfigs = inject(SharedConfigs);
  //private readonly _identityService = injectAsync(()=>import('../identity/identity-service').then(m=>m.IdentityService), {prefetch: onIdle});
  private readonly document = inject(DOCUMENT);
  identityService = inject(IdentityService);

  readonly logoImgSrc = computed<string>(()=>
    this.sharedConfigs.colorScheme() === 'dark' ? 
    "/Logo/HoLibz_Logo_Dark_Pink_Only.webp" : 
    "/Logo/HoLibz_Logo_Light_Blue_Only.webp"
  );
  readonly displayShadow = signal(false);

  

  @HostListener('window:scroll',[])
  onWindowScroll(){
    if(this.document.defaultView && this.document.defaultView.scrollY > 0){
      this.displayShadow.set(true);
    }
    else{
      this.displayShadow.set(false);
    }
  }

}
