import { Component, signal } from '@angular/core';
import { form, FormRoot, FormField } from '@angular/forms/signals';
import { MatError, MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';

@Component({
  imports: [FormRoot, MatFormField, MatLabel, MatInput, FormField, MatError, MatIcon, MatSuffix],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  loginModel = signal<LoginFormModel>({
    CfTurnstileResponse: '',
    Password: '',
    UsernameOrEmail: ''
  });
  loginForm = form(this.loginModel);
}

interface LoginFormModel{
  UsernameOrEmail: string;
  Password: string;
  CfTurnstileResponse: string;
}
