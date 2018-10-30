import { Component, OnInit } from '@angular/core';
import { SwaggerUI } from 'swagger-ui';

@Component({
  selector: 'imho-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {

  ngOnInit() {
    SwaggerUI({
      dom_id: '#swagger-ui',
      urls: [{
        url: 'url',
        name: 'API'
      }]
    });
  }

}
