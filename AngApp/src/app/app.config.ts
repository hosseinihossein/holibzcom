import { ApplicationConfig, ErrorHandler, provideBrowserGlobalErrorListeners } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors, withXsrfConfiguration } from '@angular/common/http';
import { MyErrorHandler } from './my-error-handler';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: ErrorHandler, useClass: MyErrorHandler},
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), // default to: provideRouter(routes, withPreloading(PreloadAllModules)),
    provideClientHydration(),
    provideHttpClient(
      //withInterceptors([authInterceptor]),
      withXsrfConfiguration({
        cookieName: "XSRF-TOKEN",
        headerName: "X-CSRF-TOKEN"
      }),
    ),
  ]
};
