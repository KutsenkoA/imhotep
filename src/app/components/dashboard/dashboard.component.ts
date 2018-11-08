import { Component } from '@angular/core';
import { tap } from 'rxjs/operators';
import { GithubService } from 'src/app/services/github.service';

@Component({
  selector: 'imho-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent {

  public lookingForContracts = true;

  public apis = this.github.find(new RegExp('^.*\.yaml$')).pipe(
    tap(() => this.lookingForContracts = false)
  );

  constructor(
    private github: GithubService
  ) {}
}
