import { HttpClient, HttpParams, httpResource } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { IdentityService } from '../identity/identity-service';

@Service()
export class UserAccountService {
  private readonly httpClient = inject(HttpClient);
  private readonly identityService = inject(IdentityService);

  readonly userProfileInfo = httpResource<UserProfileInfo>(() => 
    this.identityService.identityUserInfo.hasValue() ? 
    `/api/UserAccount/GetProfileInfo?userId=${this.identityService.identityUserInfo.value().id}` :
    undefined
  );

  constructor(){

  }

  getUserProfileInfo(userId:string){
    let httpParams = new HttpParams().set('userId',userId);
    return this.httpClient.get<UserProfileInfo>(
      "/api/UserAccount/GetProfileInfo",
      {params: httpParams}
    );
  }

  getUserAvatarUrl(userId:string){
    let httpParams = new HttpParams().set('userId',userId);
    return this.httpClient.get<{avatarUrl:string}>(
      "/api/UserAccount/GetUserAvatarUrl",
      {params: httpParams}
    );
  }

}

export interface UserProfileInfo{
  avatarUrl?: string|null;
  name?: string|null;
}
