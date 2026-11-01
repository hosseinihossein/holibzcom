import { Routes } from '@angular/router';
import { identityRoutes } from './identity/identity.routes';
import { Home } from './home/home';

export const routes: Routes = [
    {path: '', component: Home},
    ...identityRoutes,
];
