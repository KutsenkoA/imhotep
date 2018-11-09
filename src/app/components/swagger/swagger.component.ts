import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GithubService } from 'src/app/services/github.service';
import SwaggerUI from 'swagger-ui';

@Component({
  selector: 'imho-swagger',
  templateUrl: './swagger.component.html',
  styleUrls: ['./swagger.component.sass']
})
export class SwaggerComponent implements OnInit {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private githubService: GithubService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: { sha: string }) => {
      if (!this.githubService.lastSearch.length) {
        this.router.navigate(['/']);
        return;
      }
      const api = this.githubService.getApiBySha(params.sha);
      SwaggerUI({
        dom_id: '#swagger-ui',
        url: api.file.download_url,
        requestInterceptor: this.githubService.getRequestInterceptor
      });
    });
  }

}
