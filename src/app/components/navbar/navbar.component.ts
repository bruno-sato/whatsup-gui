import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/models/User';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  user: UserModel;

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {
    this.user = JSON.parse(this.loginService.getUser());
  }

  ngOnInit() {
  }

  logout(e: Event) {
    e.preventDefault();
    this.loginService.logout();
    this.router.navigate(['login']);
  }

  navigateTo() {
    const collapse = document.getElementById('collapseExample');
    collapse.classList.remove('show');
  }

  goHome() {
    if (this.user.isAdmin) {
      this.router.navigate(['/admin']);
      return;
    }
    this.router.navigate(['/home']);
    return;
  }

}
