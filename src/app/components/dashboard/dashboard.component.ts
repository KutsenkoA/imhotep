import { Component, OnInit } from '@angular/core';
import { GithubService } from 'src/app/services/github.service';
import SwaggerUI from 'swagger-ui';

@Component({
  selector: 'imho-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {

  constructor(
    private github: GithubService
  ) { }

  ngOnInit() {
    this.github.find(new RegExp('^.*\.json$'))
      .subscribe(results => console.log(results));

    window['Buffer'] = class Buffer {};

    SwaggerUI({
      dom_id: '#swagger-ui',
      url: 'https://raw.githubusercontent.com/jexia-com/yggi-modules/develop/mimir/contracts/management.yaml?token=AE76_JMGwJJ1OUL6S-stzc8IvhiYXWPMks5b6UJEwA%3D%3D',
    });
  }

}
