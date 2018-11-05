import { Injectable } from '@angular/core';

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
}
