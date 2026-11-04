import { NgOptimizedImage } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { MatButton, MatAnchor } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { WaitSpinner } from '../../shared/wait-spinner/wait-spinner';
import { IdentityService } from '../../identity/identity-service';
import { ProfileService } from './profile-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { httpResource, HttpResourceRef } from '@angular/common/http';

@Component({
  imports: [MatCardModule, MatIcon, MatButton, NgOptimizedImage, WaitSpinner,
    MatAnchor, RouterLink, ],
  selector: 'app-profile',
  styleUrl: './profile.css',
  templateUrl: './profile.html',
})
export class Profile {
  identityService = inject(IdentityService);
  userAccService = inject(ProfileService);
  activatedRoute = inject(ActivatedRoute);

  private params = toSignal(this.activatedRoute.paramMap)
  userId = computed(() =>
    this.params()?.get("userId") ?? this.identityService.myIdentityInfo()?.id
  );
  isMe = computed(()=>this.userId() && this.userId() === this.identityService.myIdentityInfo()?.id);
  
  private otherUserProfileInfo = httpResource<UserProfileInfo>(()=>
    this.isMe() ?
    undefined :
    this.userAccService.profileInfoUrl+this.userId()
  );
  userProfileInfo = computed(()=>
    this.isMe() ?
    this.userAccService.myProfileInfo.value() :
    this.otherUserProfileInfo.value()
  );

  displayWaitSpinner = signal(false);

  constructor(){
    
  }

}

export interface UserProfileInfo{
  avatarUrl?: string|null;
  name?: string|null;
  description?: string|null;
}
