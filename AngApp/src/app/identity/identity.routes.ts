import { Routes } from "@angular/router";

export const identityRoutes : Routes = [
    {path: 'identity/login', loadComponent: () => import('./login/login').then(m=>m.Login)},
    {path: 'identity/signup', loadComponent: () => import('./signup/signup').then(m=>m.Signup)},
    {path: 'identity/setting', loadComponent: () => import('./setting/setting').then(m=>m.Setting)},
    {path: 'identity/resetpassword', loadComponent: () => import('./reset-password/reset-password').then(m=>m.ResetPassword)},
];