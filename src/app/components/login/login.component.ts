import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'imho-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  constructor(
  ) { }

  ngOnInit() {
  }

  public login() {
    location.assign(
      environment.auth.github.url +
      `?client_id=${environment.auth.github.client_id}` +
      `&redirect_uri=${environment.auth.github.redirect.code_url}` +
      `&scope=${environment.auth.github.scope}`
    );
  }
}
