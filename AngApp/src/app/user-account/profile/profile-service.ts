import { HttpClient, HttpParams, httpResource } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { IdentityService } from '../../identity/identity-service';
import { UserProfileInfo } from './profile';

@Service()
export class ProfileService {
  private readonly httpClient = inject(HttpClient);
  private readonly identityService = inject(IdentityService);

  readonly profileInfoUrl = "/api/UserAccount/GetProfileInfo?userId=";
  readonly myProfileInfo = httpResource<UserProfileInfo>(() => 
    this.identityService.myIdentityInfo()?.id ?
    `${this.profileInfoUrl}${this.identityService.myIdentityInfo()?.id}` :
    undefined
  );

  constructor(){

  }

  getUserAvatarUrl(userId:string){
    let httpParams = new HttpParams().set('userId',userId);
    return this.httpClient.get<{avatarUrl:string}>(
      "/api/UserAccount/GetUserAvatarUrl",
      {params: httpParams}
    );
  }

}

