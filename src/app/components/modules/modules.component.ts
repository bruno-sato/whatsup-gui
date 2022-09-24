import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModulesService } from 'src/app/services/modules.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomErrorHandler } from '../shared/utils/errorHandler';
import { log } from 'util';
import { ModuleModel } from 'src/app/models/Module';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.scss']
})
export class ModulesComponent implements OnInit {

  modules: Array<ModuleModel> = [];
  page = 1;
  totalItems;
  showLoader = true;
  showModal = false;
  showModalAdd = false;

  constructor(
    private router: Router,
    private moduleService: ModulesService,
    private toastr: ToastrService
  ) { }

  getModules(page: number) {
    this.moduleService.getAll(page).subscribe((modules: any) => {
      this.page = modules.page;
      this.totalItems = modules.total;
      this.modules = modules.data;
      this.showLoader = false;
    }, (err: HttpErrorResponse) => {
      const errorHandler = new CustomErrorHandler();
      this.toastr.error(errorHandler.handlerHttpError(err));
      this.showLoader = false;
    });
  }

  ngOnInit() {
    this.getModules(this.page);
  }

  changePage(e: number) {
    this.showLoader = true;
    this.getModules(e);
  }

  moduleDetails(module) {
    this.router.navigate(['modules/' + module.id]);
  }

  pageChange(e: number) {
    this.showLoader = true;
    this.moduleService.getAll(e)
      .subscribe((response: any) => {
        this.modules = response.data;
        this.page = response.page;
        this.totalItems = response.total;
        this.showLoader = false;
      }, err => {
        const errorHandler = new CustomErrorHandler();
        this.toastr.error(errorHandler.handlerHttpError(err));
        this.showLoader = false;
      });
  }

  closeModalAdd(e: ModuleModel) {
    this.showModalAdd = false;
    if (e) {
      this.modules.unshift(e);
    }
  }

  delete(selectedModule) {
    const deletar = window.confirm('Please, confirm to delete this module?');
    if (deletar) {
      this.showLoader = true;
      this.moduleService.delete(selectedModule.id)
        .subscribe(data => {
          this.toastr.success('Module deleted sucessfully!');
          this.modules = this.modules.filter((module: ModuleModel) => {
              return module.id !== selectedModule.id;
          });
          this.showLoader = false;
        }, err => {
          this.toastr.error('An error has occurred.');
          this.showLoader = false;
        });
    }
  }

}
