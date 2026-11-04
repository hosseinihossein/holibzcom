import { Routes } from "@angular/router";
import { authGaurd } from "../../identity/auth-guard";

export const profileRoutes : Routes = [
    {
        path: 'UserAccount/profile/:userId',
        loadComponent: () => import('./profile').then(m=>m.Profile),
    },
    {
        path: 'UserAccount/ProfileSetting',
        loadComponent: () => import('./profile-setting/profile-setting').then(m=>m.ProfileSetting),
        canActivate: [authGaurd],
    },
];