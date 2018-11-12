import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { GithubService } from 'src/app/services/github.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'imho-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent {

  public lookingForContracts = true;

  public error: HttpErrorResponse;

  public apis = this.findContracts();

  constructor(
    private router: Router,
    private authService: AuthService,
    private github: GithubService
  ) {}

  private findContracts() {
    return this.github.find(new RegExp('^.*\.yaml$')).pipe(
      map(repos => repos.reduce((acc, current) => {
        const repo = acc.find(r => r.name === current.repo.name);
        if (repo) {
          repo.files.push(current.file);
        } else {
          acc.push({
            name: current.repo.name,
            files: [current.file]
          });
        }
        return acc;
      }, [])),
      tap(() => this.lookingForContracts = false),
      catchError(error => {
        this.error = error;
        return of([]);
      })
    );
  }

  public tryAgain() {
    this.error = null;
    this.apis = this.findContracts();
  }

  public goGithub() {
    location.assign(environment.auth.github.settings);
  }

  public authorize() {
    this.authService.tokenRevoked();
  }
}
