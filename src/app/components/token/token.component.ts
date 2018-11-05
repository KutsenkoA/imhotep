import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

interface GitHubToken {
  access_token: string;
  token_type: string;
  scope: string;
  error?: string;
  error_description?: string;
  error_uri?: string;
}

@Component({
  selector: 'imho-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.sass']
})
export class TokenComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.pipe(
      switchMap((params: {code: string}) => this.http.post(
        environment.auth.github.exchange_url +
        `?client_id=${environment.auth.github.client_id}` +
        `&client_secret=${environment.auth.github.client_secret}` +
        `&code=${params.code}`, null,
        { headers: new HttpHeaders({
            'Accept': 'application/json'
          })}
      ))
    ).subscribe((result: GitHubToken) => {
      if (result.error) {
        const { error, error_description, error_uri } = result;
        console.log(error, error_description, error_uri);
      } else {
        this.authService.token = result.access_token;
        this.router.navigate(['/']);
      }
    });
  }

}
