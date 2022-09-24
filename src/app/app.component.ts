import { Component, OnInit } from '@angular/core';
import { LoginService } from './services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'wpp';
  isLoged = false;
  showHelp = false;

  constructor(
    private loginService: LoginService
  ) {
    this.isLoged = this.loginService.isLoged();
    const user = JSON.parse(this.loginService.getUser());
    if (user && !user['isAdmin']) {
      this.showHelp = true;
    }
  }

  ngOnInit() {
    this.loginService.sessionEvent.subscribe(data => {
      this.isLoged = data;
    });
  }
}
