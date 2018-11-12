import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_NAME = 'github_token';

  constructor() { }

  /* Return GitHub Token */
  public get token(): string {
    return localStorage.getItem(this.TOKEN_NAME);
  }

  public set token(token: string) {
    localStorage.setItem(this.TOKEN_NAME, token);
  }

  public tokenRevoked() {
    localStorage.removeItem(this.TOKEN_NAME);
    this.goGithub();
  }

  public goGithub() {
    location.assign(
      environment.auth.github.url +
      `?client_id=${environment.auth.github.client_id}` +
      `&redirect_uri=${environment.auth.github.redirect.code_url}` +
      `&scope=${environment.auth.github.scope}`
    );
  }
}
