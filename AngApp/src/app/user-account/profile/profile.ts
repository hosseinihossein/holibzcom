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
  profileService = inject(ProfileService);
  activatedRoute = inject(ActivatedRoute);

  private params = toSignal(this.activatedRoute.paramMap)
  userId = computed(() =>
    this.params()?.get("userId") ?? this.identityService.myIdentityInfo.value()?.id
  );
  isMe = computed(()=>this.userId() && this.userId() === this.identityService.myIdentityInfo.value()?.id);
  
  private otherProfileInfo = httpResource<UserProfileInfo>(()=>
    this.isMe() ?
    undefined :
    this.profileService.profileInfoUrl+this.userId()
  );
  profileInfo = computed(()=>
    this.isMe() ?
    this.profileService.myProfileInfo.value() :
    this.otherProfileInfo.value()
  );
  
  private otherProfileUsername = httpResource<string>(()=>
    this.isMe() ?
    undefined :
    this.identityService.GetUsernameUrl+this.userId()
  );
  profileUsername = computed(()=>
    this.isMe() ?
    this.identityService.myIdentityInfo.value()?.userName :
    this.otherProfileUsername.value()
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
