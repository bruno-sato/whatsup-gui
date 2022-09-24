import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label, Color, BaseChartDirective } from 'ng2-charts';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    }
  };
  public pieChartLabels: Label[] = [];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartColors = [
    {
      backgroundColor: [
        'rgba(255,127,27,0.3)',
        'rgba(27,34,255,0.3)',
        'rgba(79,255,27,0.3)',
        'rgba(245,255,27,0.3)',
        'rgba(255,27,27,0.3)'
      ],
    },
  ];
  userCount;

  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

  constructor(
    private router: Router,
    private userService: UsersService
  ) { }

  showModalAdd = false;

  ngOnInit() {
    this.userService.getUsersCount()
      .subscribe(data => {
        this.userCount = data;
      }, err => {
        console.log(err);
      });
    this.userService.getWorstStudents()
      .subscribe((data: any[]) => {
        data.forEach(value => {
          this.pieChartLabels.push(value.username);
          this.pieChartData.push(value.quantidade);
        });
      }, err => {

      });
  }

  closeModalAdd(e: Event) {
    this.showModalAdd = false;
    if (e) {
      this.router.navigate(['modules']);
    }
  }

  goToModules() {
    this.router.navigate(['modules']);
  }

}
