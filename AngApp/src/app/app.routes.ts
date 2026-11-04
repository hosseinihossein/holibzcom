import { Routes } from '@angular/router';
import { identityRoutes } from './identity/identity.routes';
import { Home } from './home/home';
import { userAccountRoutes } from './user-account/user-account-routes';

export const routes: Routes = [
    {path: '', component: Home},
    ...identityRoutes,
    ...userAccountRoutes,
];
