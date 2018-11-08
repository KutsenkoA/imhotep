import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

    if (!this.authService.token) {
      location.assign(
        environment.auth.github.url +
        `?client_id=${environment.auth.github.client_id}` +
        `&redirect_uri=${environment.auth.github.redirect.code_url}` +
        `&scope=${environment.auth.github.scope}`
      );
    }
    return true;
  }
}
