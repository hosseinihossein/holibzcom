import { Component, signal } from '@angular/core';
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { form, maxLength, minLength, required, validate, FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-change-password',
  imports: [MatDialogContent, MatDialogActions, MatFormField, MatInput, MatLabel,
    MatButton, MatDialogClose, MatError, FormField, MatSuffix],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css'
})
export class ChangePassword {
  //readonly changePasswordDialogRef = inject(MatDialogRef<ChangePassword>);
  //readonly data = inject<{label:string, value:string}>(MAT_DIALOG_DATA);

  changePasswordModel = signal<ChangePasswordFormModel>({
    CurrentPassword:'',
    NewPassword:'',
    RepeatNewPassword:'',
  });
  changePasswordForm = form(this.changePasswordModel,
    (schemaPath)=>{
      required(schemaPath.CurrentPassword, {message: 'Please enter your current password'});
      maxLength(schemaPath.CurrentPassword, 60, {message: 'Password cannot be more than 60 characters!'});
      minLength(schemaPath.CurrentPassword, 8, {message: 'Password cannot be less than 8 characters!'});
      
      required(schemaPath.NewPassword, {message: 'Please enter your current password'});
      maxLength(schemaPath.NewPassword, 60, {message: 'Password cannot be more than 60 characters!'});
      minLength(schemaPath.NewPassword, 8, {message: 'Password cannot be less than 8 characters!'});

      validate(schemaPath.RepeatNewPassword, ({value, valueOf}) => {
        const confirmPassword = value();
        const password = valueOf(schemaPath.NewPassword);
        if (confirmPassword !== password) {
          return {
            kind: 'passwordMismatch',
            message: 'New passwords do not match!',
          };
        }
        return null;
      });
    },
  );

}

export interface ChangePasswordFormModel{
  CurrentPassword:string;
  NewPassword:string;
  RepeatNewPassword:string;
}
