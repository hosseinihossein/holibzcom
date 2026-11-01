import { inject, Service } from '@angular/core';
import { LoginFormModel } from './login/login';
import { HttpClient, HttpParams } from '@angular/common/http';

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
}
