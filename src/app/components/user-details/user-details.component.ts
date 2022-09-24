import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { CustomErrorHandler } from '../shared/utils/errorHandler';
import { ModulesService } from 'src/app/services/modules.service';
import { ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  showLoader = true;
  user;
  page = 1;
  userModules = [];
  modulesPage = 1;
  keepScroll = true;
  answeredQuestions;
  modules;

  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    }
  };
  public pieChartLabels: Label[] = ['Wrong answers', 'Correct answers'];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)'],
    },
  ];

  constructor(
    private router: Router,
    private userService: UsersService,
    private moduleService: ModulesService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.userService.getUser(parseInt(this.router.url.split('/')[2], 10))
      .subscribe(data => {
        this.user = data;
        data.modules.forEach(element => {
          this.userModules.push(element.id);
        });
        this.showLoader = false;
        this.getModules();
      }, (err: HttpErrorResponse) => {
        const errorHandler = new CustomErrorHandler();
        this.router.navigate(['/users']);
        this.showLoader = false;
        this.toastr.error(errorHandler.handlerHttpError(err));
      });
    this.userService.getAnsweredQuestions(parseInt(this.router.url.split('/')[2], 10))
      .subscribe((data: any) => {
        this.pieChartData.push(data.wrong);
        this.pieChartData.push(data.correct);
      }, err => {

      });
  }

  getModules(): void {
    this.moduleService.getAll(this.modulesPage)
      .subscribe((response: any) => {
        response.data.forEach(element => {
          if (this.userModules.indexOf(element.id) > -1) {
            element['checked'] = true;
          }
        });
        this.modules = response.data;
      }, err => {
        console.log(err);
      });
  }

  onScroll() {
    this.modulesPage++;
    this.moduleService.getAll(this.modulesPage)
    .subscribe((response: any) => {
      if (response.lastPage < 20) {
        this.keepScroll = !this.keepScroll;
      }
      response.data.forEach(element => {
        if (this.userModules.indexOf(element.id) > -1) {
          element['checked'] = true;
        }
      });
      this.modules.push(...response.data);
    });
  }

  setModule(moduleId: number) {
    this.userService.setModule(this.user.id, moduleId)
      .subscribe(response => {
        if (!response) {
          this.user.modules = this.user.modules.filter(data => {
            if (data.id === moduleId) {
              return false;
            }
            return true;
          });
        } else {
          this.user.modules.push(response);
        }
        this.userService.getAnsweredQuestions(parseInt(this.router.url.split('/')[2], 10))
          .subscribe((data: any) => {
            this.pieChartData.push(data.wrong);
            this.pieChartData.push(data.correct);
          }, err => {

          });
      }, error => {
        console.log(error);
      });
  }

}
