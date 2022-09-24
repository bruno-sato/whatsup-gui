import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomErrorHandler } from '../shared/utils/errorHandler';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  showLoader = true;
  page = 1;
  totalItems;
  users = [];

  constructor(
    private userService: UsersService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getUsers(this.page);
  }

  getUsers(page: number): void {
    this.userService.getAll(page)
      .subscribe((response: any) => {
        this.page = response.page;
        this.totalItems = response.total;
        this.users = response.data;
        this.closeLoader();
      }, (err: HttpErrorResponse) => {
        const errorHandler = new CustomErrorHandler();
        this.toastr.error(errorHandler.handlerHttpError(err));
        this.closeLoader();
      });
  }

  setUserAdmin(userId: number) {
    const setAdmin = window.confirm('Be sure, this cannot be undone');
    if (setAdmin) {
      this.showLoader = true;
      this.userService.setUserAsAdmin(userId)
        .subscribe(data => {
          this.users = this.users.filter(user => user.id !== userId);
          this.closeLoader();
          this.toastr.success('User are now a administrator');
        }, err => {
          this.closeLoader();
          this.toastr.error('An error has ocurred');
        });
    }
  }

  inactivate(userId) {
    this.showLoader = true;
    this.userService.inactiveUser(userId)
      .subscribe(data => {
        this.users = this.users.map(user => {
          if (user.id === userId) {
            user.activated = false;
          }
          return user;
        });
        this.closeLoader();
      }, (err: HttpErrorResponse) => {
        this.closeLoader();
        const errorHandler = new CustomErrorHandler();
        this.toastr.error(errorHandler.handlerHttpError(err));
      });
  }

  activateUser(userId) {
    this.showLoader = true;
    this.userService.activateUser(userId)
      .subscribe(data => {
        this.users = this.users.map(user => {
          if (user.id === userId) {
            user.activated = true;
          }
          return user;
        });
        this.closeLoader();
      }, (err: HttpErrorResponse) => {
        this.closeLoader();
        const errorHandler = new CustomErrorHandler();
        this.toastr.error(errorHandler.handlerHttpError(err));
      });
  }

  closeLoader(): void {
    this.showLoader = false;
  }

  changePage(e: number): void {
    this.showLoader = true;
    this.getUsers(e);
  }

  goToDetails(userId: number): void {
    this.router.navigate([`/users/${userId}`]);
  }

}
