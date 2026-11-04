import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { IdentityService } from "./identity-service";

export const authGaurd : CanActivateFn = (route, state) => {
  const identityService = inject(IdentityService);
  const router = inject(Router);
  if(identityService.isAuthenticated()){
    return true;
  }
  return router.createUrlTree(["/identity/login"],{ queryParams: {ReturnUrl: state.url}});
};