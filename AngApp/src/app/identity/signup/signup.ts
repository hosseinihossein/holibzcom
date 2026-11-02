import { NgOptimizedImage } from '@angular/common';
import { afterNextRender, Component, computed, inject, injectAsync, onIdle, signal } from '@angular/core';
import { FormRoot, FormField, form, maxLength, minLength, required, email, validate, FieldTree } from '@angular/forms/signals';
import { MatFabButton, MatButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatError, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { WaitSpinner } from '../../shared/wait-spinner/wait-spinner';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  imports: [FormRoot, MatFormField, MatLabel, MatInput, FormField, MatError, MatIcon, MatSuffix,
    RouterLink, WaitSpinner, NgOptimizedImage, MatTooltip, MatFabButton, MatButton
  ],
  selector: 'app-signup',
  styleUrl: './signup.css',
  templateUrl: './signup.html',
})
export class Signup {
  _turnstileService = injectAsync(()=>import('../../shared/services/turnstile-service').then(m=>m.TurnstileService),{prefetch: onIdle});
  _identityService = injectAsync(()=>import('../identity-service').then(m=>m.IdentityService), {prefetch: onIdle});
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  generalError = signal('');
  displayWait = signal(false);
  turnstileEnabled = signal(false);

  signupModel = signal<SignupFormModel>({
    CfTurnstileResponse: '',
    Password: '',
    ConfirmPassword: '',
    Email: '',
    Username: '',
  });
  signupForm = form(this.signupModel, 
    (schemaPath) => {
      required(schemaPath.Email, {message:"Email is required!"});
      minLength(schemaPath.Email, 3, {message: "Email must be at least 3 characters!"})
      maxLength(schemaPath.Email, 128, {message: "Email cannot be more than 128 characters!"})
      email(schemaPath.Email, {message: "Email format is not correct!"});
      
      required(schemaPath.Username, {message:"Username is required!"});
      minLength(schemaPath.Username, 3, {message: "Username must be at least 3 characters!"})
      maxLength(schemaPath.Username, 60, {message: "Username cannot be more than 60 characters!"})
      
      required(schemaPath.Password, {message:"Enter your Password!"});
      minLength(schemaPath.Password, 8, {message:"Password must be at least 8 characters!"});
      maxLength(schemaPath.Password, 60, {message:"Password cannot be more than 60 characters!"});
      
      required(schemaPath.ConfirmPassword, {message:"Enter your Password again!"});
      validate(schemaPath.ConfirmPassword, ({value, valueOf}) => {
        const confirmPassword = value();
        const password = valueOf(schemaPath.Password);
        if (confirmPassword !== password) {
          return {
            kind: 'passwordMismatch',
            message: 'Passwords do not match!',
          };
        }
        return null;
      });
    },
    {
      submission: {
        action: async (field) => {
          const identityService = await this._identityService();
          this.displayWait.set(true);

          let result:{kind:string,message:string,fieldTree:FieldTree<SignupFormModel|string, string | number, "writable">}[]|null = null;
          try{
            let res = await firstValueFrom(identityService.submitSignup(this.signupModel()));
            if(res.success){
              let returnUrl = this.activatedRoute.snapshot.queryParamMap.get("ReturnUrl") || "/";
              const destinationPath = new URL(returnUrl).pathname;
              this.router.navigateByUrl(destinationPath, {replaceUrl: true});
            }
          }
          catch(err){
            if(err instanceof HttpErrorResponse && err.status == HttpStatusCode.BadRequest){
              //console.error("BadRequest err: "+err.error);
              result ??= [];
              if(err.error.Email || err.error.errors?.Email){
                result.push({
                  kind: "Email",
                  message: err.error.Email || err.error.errors?.Email,
                  fieldTree: field.Email
                });
              }
              if(err.error.Username || err.error.errors?.Username){
                result.push({
                  kind: "Username",
                  message: err.error.Username || err.error.errors?.Username,
                  fieldTree: field.Username
                });
              }
              if(err.error.Password || err.error.errors?.Password){
                result.push({
                  kind: "Password",
                  message: err.error.Password || err.error.errors?.Password,
                  fieldTree: field.Password
                });
              }
              if(err.error.CfTurnstileResponse || err.error.errors?.CfTurnstileResponse){
                result.push({
                  kind: "CfTurnstileResponse",
                  message: err.error.CfTurnstileResponse || err.error.errors?.CfTurnstileResponse,
                  fieldTree: field.CfTurnstileResponse
                });
              }
              
              result.push({
                kind: "LoginError",
                message: "An error occured during login: " + err.message,
                fieldTree: field
              });
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
        turnstileService.loadWidget(this.signupForm.CfTurnstileResponse, this.generalError);
      }
    });
  }
  
}

export interface SignupFormModel{
  Email: string;
  Username: string;
  Password: string;
  ConfirmPassword: string;
  CfTurnstileResponse: string;
}
