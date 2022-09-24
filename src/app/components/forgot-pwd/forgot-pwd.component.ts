import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-pwd',
  templateUrl: './forgot-pwd.component.html',
  styleUrls: ['./forgot-pwd.component.scss']
})
export class ForgotPwdComponent implements OnInit {

  showLoader = false;
  pwdCode;
  email;
  code;
  newPwd;

  constructor(
    private userService: UsersService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  getRandomCode() {
    if (this.email) {
      this.showLoader = true;
      this.userService.getPwdCode(this.email)
        .subscribe(data => {
          this.showLoader = false;
          this.pwdCode = data['reset_pwd_code'];
        }, err => {
          this.showLoader = false;
        });
    }
  }

  saveNewPwd() {
    if (this.code === this.pwdCode) {
      if (this.newPwd) {
        this.showLoader = true;
        this.userService.saveNewPwd(this.email, this.newPwd)
          .subscribe(data => {
            this.showLoader = false;
            this.toastr.success('You password has been saved');
            this.router.navigate(['/login']);
          }, err => {
            this.showLoader = false;
            this.toastr.error('A error has ocurred.');
          });
      }
    } else {
      this.toastr.error('Verify if your code are correct');
    }
  }

}
