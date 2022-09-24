import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

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

  formSignUp = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  ngOnInit() {
  }

  signup(e: Event) {
    if (this.formSignUp.valid) {
      this.loginService.signup(
        this.formSignUp.value.name,
        this.formSignUp.value.email,
        this.formSignUp.value.password
      ).subscribe(data => {
        this.toastr.success('Em breve você receberá um email de confirmação.');
        this.router.navigate(['login']);
      }, err => {
        this.toastr.error('Ops, tivemos um erro. Tente novamente mais tarde');
      });
    } else {
      this.toastr.error('Verifique se todos os campos estão preenchidos.');
    }
  }

}
