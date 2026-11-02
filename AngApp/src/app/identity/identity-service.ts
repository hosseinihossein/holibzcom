import { inject, Service } from '@angular/core';
import { LoginFormModel } from './login/login';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SignupFormModel } from './signup/signup';

@Service()
export class IdentityService {
  private readonly httpClient = inject(HttpClient);

  submitLogin(formModel: LoginFormModel){
    let httpParams = new HttpParams()
    .set("CfTurnstileResponse", formModel.CfTurnstileResponse)
    .set("Password", formModel.Password)
    .set("UsernameOrEmail",formModel.UsernameOrEmail)
    .set("ReturnUrl",formModel.ReturnUrl);

    return this.httpClient.post("/api/identity/Login", httpParams, { observe: 'response' });
  }

  submitSignup(formModel: SignupFormModel){
    let formData = new FormData();
    formData.set("CfTurnstileResponse",formModel.CfTurnstileResponse);
    formData.set("Email",formModel.Email);
    formData.set("Username",formModel.Username);
    formData.set("Password",formModel.Password);

    return this.httpClient.post<{success:boolean}>("/api/identity/Signup", formData);
  }



}
