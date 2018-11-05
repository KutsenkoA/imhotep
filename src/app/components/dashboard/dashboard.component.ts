import { Component, OnInit } from '@angular/core';
import { GithubService } from 'src/app/services/github.service';
import SwaggerUI from 'swagger-ui';

@Component({
  selector: 'imho-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {

  public lookingForContracts = true;

  public apis = [];

  constructor(
    private github: GithubService
  ) { }

  ngOnInit() {
    this.github.find(new RegExp('^.*\.yaml$'))
      .subscribe(results => {
        this.apis = results;
        console.log(results);
        this.lookingForContracts = false;

        if (this.apis.length) {
          SwaggerUI({
            dom_id: '#swagger-ui',
            url: this.apis[0].download_url
          });
        }
      });

    window['Buffer'] = class Buffer {};
  }

  public changeApi(e) {
    console.log(e);
  }

}
