import { afterNextRender, Component, effect, inject, injectAsync, onIdle, signal } from '@angular/core';
import { form, FormRoot, FormField, required, minLength, FieldTree } from '@angular/forms/signals';
import { MatError, MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { TurnstileService } from '../../shared/services/turnstile-service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { WaitSpinner } from '../../shared/wait-spinner/wait-spinner';
import { NgOptimizedImage } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { MatButton, MatFabButton } from '@angular/material/button';
import { IdentityService } from '../identity-service';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

@Component({
  imports: [FormRoot, MatFormField, MatLabel, MatInput, FormField, MatError, MatIcon, MatSuffix,
    RouterLink, WaitSpinner, NgOptimizedImage, MatTooltip, MatFabButton, MatButton
  ],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  _turnstileService = injectAsync(()=>import('../../shared/services/turnstile-service').then(m=>m.TurnstileService),{prefetch: onIdle});
  activatedRoute = inject(ActivatedRoute);
  _identityService = injectAsync(()=>import('../identity-service').then(m=>m.IdentityService), {prefetch: onIdle});
  router = inject(Router);

  generalError = signal('');
  displayWait = signal(false);
  turnstileEnabled = signal(false);

  loginModel = signal<LoginFormModel>({
    CfTurnstileResponse: '',
    Password: '',
    UsernameOrEmail: '',
    ReturnUrl: this.activatedRoute.snapshot.queryParamMap.get("ReturnUrl") || "/",
  });
  loginForm = form(this.loginModel,
    (schemaPath)=>{
      required(schemaPath.UsernameOrEmail, {message:"Username or Email is required!"});
      
      required(schemaPath.Password, {message:"Enter your Password!"});
      minLength(schemaPath.Password, 8, {message:"Password must be at least 8 characters!"});
    },
    {
      submission: {
        action: async (field) => {
          const identityService = await this._identityService();
          this.displayWait.set(true);

          let result:{kind:string,message:string,fieldTree:FieldTree<LoginFormModel|string, string | number, "writable">}[]|null = null;
          try{
            let res = await firstValueFrom(identityService.submitLogin(this.loginModel()));
            if(res.redirected && res.url){
              const destinationPath = new URL(res.url).pathname;
              this.router.navigateByUrl(destinationPath, {replaceUrl: true});
            }
          }
          catch(err){
            if(err instanceof HttpErrorResponse && err.status == HttpStatusCode.BadRequest){
              //console.error("BadRequest err: "+err.error);
              result ??= [];
              if(err.error.UsernameOrEmail || err.error.errors?.UsernameOrEmail){
                result.push({
                  kind: "UsernameOrEmail",
                  message: err.error.UsernameOrEmail || err.error.errors?.UsernameOrEmail,
                  fieldTree: field.UsernameOrEmail
                });
              }
              else if(err.error.Password || err.error.errors?.Password){
                result.push({
                  kind: "Password",
                  message: err.error.Password || err.error.errors?.Password,
                  fieldTree: field.Password
                });
              }
              else if(err.error.CfTurnstileResponse || err.error.errors?.CfTurnstileResponse){
                result.push({
                  kind: "CfTurnstileResponse",
                  message: err.error.CfTurnstileResponse || err.error.errors?.CfTurnstileResponse,
                  fieldTree: field.CfTurnstileResponse
                });
              }
              else{
                result.push({
                  kind: "LoginError",
                  message: err.message,
                  fieldTree: field
                });
              }
            }
          }
          this.displayWait.set(false);
          const turnstileService = await this._turnstileService();
          if(result){
            turnstileService.resetWidget();
          }
          return result;
        },
      }
    }
  );

  constructor(){
    afterNextRender(async ()=>{
      const turnstileService = await this._turnstileService();
      if(turnstileService.isEnabled()){
        this.turnstileEnabled.set(true);
        turnstileService.loadWidget(this.loginForm.CfTurnstileResponse, this.generalError);
      }
    });
  }

  forgetPassword(){}


}

export interface LoginFormModel{
  UsernameOrEmail: string;
  Password: string;
  CfTurnstileResponse: string;
  ReturnUrl: string;
}
