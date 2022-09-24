import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserModel } from 'src/app/models/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private router: Router,
    private loginService: LoginService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    if (this.loginService.isLoged()) {
      this.router.navigate(['home']);
    }
  }

  showLoader = false;

  formLogin = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  ngOnInit() {
  }

  goToAdminDashboard() {
    this.router.navigate(['admin']);
  }

  goToDashboard() {
    this.router.navigate(['home']);
  }

  login(e: Event) {
    e.preventDefault();
    this.showLoader = true;
    if (this.formLogin.valid) {
      this.loginService.login(this.formLogin.value.email, this.formLogin.value.password)
        .subscribe((data: UserModel) => {
          this.loginService.saveUser(JSON.stringify(data));
          if (data.isAdmin) {
            this.goToAdminDashboard();
          } else {
            this.goToDashboard();
          }
          this.showLoader = false;
        }, err => {
          this.showLoader = false;
          this.toastr.error('Houve um problema tentando logar, verifique suas informações e tente novamente. T.T');
        });
    } else {
      this.showLoader = false;
      this.toastr.error('Ops, verifique suas informações e tente novamente.');
    }
  }

}
