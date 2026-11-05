import { afterNextRender, computed, inject, PLATFORM_ID, Service, signal } from '@angular/core';
import { LoginFormModel } from './login/login';
import { HttpClient, HttpParams, httpResource } from '@angular/common/http';
import { SignupFormModel } from './signup/signup';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Service()
export class IdentityService {
  private readonly httpClient = inject(HttpClient);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly _isAuthenticated = signal(false);
  readonly isAuthenticated = computed(()=>this.myIdentityInfo.hasValue());

  readonly myIdentityInfo = httpResource<IdentityUserModel>(() => this.isBrowser ? "/api/identity/CheckAuthentication" : undefined);

  readonly GetUsernameUrl = "/api/identity/GetUsername?userId=";

  constructor(){}

  submitLogin(formModel: LoginFormModel){
    let httpParams = new HttpParams()
    .set("CfTurnstileResponse", formModel.CfTurnstileResponse)
    .set("Password", formModel.Password)
    .set("UsernameOrEmail",formModel.UsernameOrEmail)
    .set("ReturnUrl",formModel.ReturnUrl);

    return this.httpClient.post("/api/identity/Login", httpParams, { observe: 'response' }).pipe(
      tap({
        next: res => {
          if(res.ok){
            this.myIdentityInfo.reload();
          }
        }
      }),
    );
  }

  submitSignup(formModel: SignupFormModel){
    let formData = new FormData();
    formData.set("CfTurnstileResponse",formModel.CfTurnstileResponse);
    formData.set("Email",formModel.Email);
    formData.set("Username",formModel.Username);
    formData.set("Password",formModel.Password);

    return this.httpClient.post<{success:boolean}>("/api/identity/Signup", formData).pipe(
      tap({
        next: res => {
          if(res.success){
            this.myIdentityInfo.reload();
          }
        }
      }),
    );
  }

  logout(){
    this.httpClient.post("/api/identity/Logout", null).pipe(
      tap({
        next: () => {
          this.myIdentityInfo.reload();
        }
      }),
    );
  }

  getUsername(userId:string){
    const httpParams = new HttpParams().set("userId",userId);
    return this.httpClient.get<{username:string|null}>("/api/identity/GetUsername",{params:httpParams});
  }

  

}

export interface IdentityUserModel{
  id: string;
  userName: string;
  email: string;
  emailConfirmed: boolean;
  roles: string[];
}
