import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {path: '', renderMode: RenderMode.Prerender},
  {path: 'identity/login', renderMode: RenderMode.Prerender},
  {path: 'identity/signup', renderMode: RenderMode.Prerender},
  {path: 'identity/resetpassword', renderMode: RenderMode.Prerender},
  {path: 'identity/setting', renderMode: RenderMode.Prerender},
  {path: 'UserAccount/Profile/:userId', renderMode: RenderMode.Client},
  {path: 'UserAccount/Profile', renderMode: RenderMode.Client},
  {path: 'UserAccount/ProfileSetting', renderMode: RenderMode.Client},
  /*{
    path: '**',
    renderMode: RenderMode.Prerender
  }*/
];
