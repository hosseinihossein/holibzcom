import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { Component, inject, input, PLATFORM_ID } from '@angular/core';
import { MatCard, MatCardHeader, MatCardAvatar, MatCardTitle, MatCardSubtitle, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { LibraryService } from '../library-service';
import { httpResource } from '@angular/common/http';
import { IdentityService } from '../../identity/identity-service';

@Component({
  imports: [MatCard, MatCardHeader, MatCardAvatar, MatCardTitle, MatCardSubtitle, MatCardContent,
    MatIcon, NgOptimizedImage, RouterLink],
  selector: 'app-library-card',
  styleUrl: './library-card.css',
  templateUrl: './library-card.html',
  host: {
    "(click)": "openLibrary()",
  }
})
export class LibraryCard {
  libraryId = input.required<string>();

  router = inject(Router);
  libraryService = inject(LibraryService);
  isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  identityService = inject(IdentityService);

  libraryCardInfo = httpResource<LibraryCardModel>(()=>
    this.isBrowser ? 
    this.libraryService.libraryCardInfoUrl + this.libraryId() :
    undefined
  );
  ownerUsername = httpResource<string|null>(()=>
    this.libraryCardInfo.hasValue() ?
    this.identityService.GetUsernameUrl + this.libraryCardInfo.value()?.id :
    undefined
  );

  constructor(){}

  openLibrary(){
    this.router.navigate(["/Library", this.libraryId()]);
  }
}

export interface LibraryCardModel{
  id:string;
  ownerId:string;
  title:string;
  description?:string|null;
  imageUrl?:string|null;
  shelves:string[];
}
