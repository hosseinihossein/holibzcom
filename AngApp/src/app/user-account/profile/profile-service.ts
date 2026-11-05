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
    this.identityService.isAuthenticated() ?
    `${this.profileInfoUrl}${this.identityService.myIdentityInfo.value()?.id}` :
    undefined
  );

  constructor(){}

  getUserAvatarUrl(userId:string){
    let httpParams = new HttpParams().set('userId',userId);
    return this.httpClient.get<{avatarUrl:string}>(
      "/api/UserAccount/GetUserAvatarUrl",
      {params: httpParams}
    );
  }

  saveUserAvatar(image:File){
    const formData = new FormData();
    formData.append('userImageFile', image);
    return this.httpClient.post<{success: boolean}>(
      "/api/UserProfile/SubmitUserImage", formData
    );
  }

  deleteUserAvatar(){
    return this.httpClient.delete<{success:boolean}>(
      "/api/Profile/DeleteUserImage"
    );
  }

  changeName(name:string){
    let httpParams = new HttpParams().set("name",name);
    return this.httpClient.post<{success:boolean}>(
      `/api/Profile/SubmitProfileName`, httpParams
    );
  }

  changeDescription(description:string){
    let httpParams = new HttpParams().set("description",description);
    return this.httpClient.post<{success:boolean}>(
      `/api/Profile/SubmitDescription`, httpParams
    );
  }

}

