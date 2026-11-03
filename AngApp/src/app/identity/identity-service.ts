import { afterNextRender, computed, inject, Service, signal } from '@angular/core';
import { LoginFormModel } from './login/login';
import { HttpClient, HttpParams, httpResource } from '@angular/common/http';
import { SignupFormModel } from './signup/signup';
import { tap } from 'rxjs/operators';

@Service()
export class IdentityService {
  private readonly httpClient = inject(HttpClient);

  private readonly _isAuthenticated = signal(false);
  readonly isAuthenticated = computed(()=>this._isAuthenticated());

  readonly identityUserInfo = httpResource<IdentityUserModel>(() => this.isAuthenticated() ? "/api/identity/GetUserInfo" : undefined);

  constructore(){
    afterNextRender(()=>{
      this.checkAuthentication()
    });
  }

  private checkAuthentication(){
    this.httpClient.get<{isAuthenticated:boolean}>("/api/identity/IsAhuthenticated").subscribe((res)=>{
      if(res && res.isAuthenticated){
        this._isAuthenticated.set(true);
      }
      else{
        this._isAuthenticated.set(false);
      }
    });
  }

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
            this.checkAuthentication();
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
            this.checkAuthentication();
          }
        }
      }),
    );
  }

  logout(){
    this.httpClient.post("/api/identity/Logout", null).pipe(
      tap({
        next: () => {
          this.checkAuthentication();
        }
      }),
    );
  }

  

}

export interface IdentityUserModel{
  id: string;
  userName: string;
  email: string;
  emailConfirmed: boolean;
  roles: string[];
}
