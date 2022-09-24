import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ModulesService } from 'src/app/services/modules.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomErrorHandler } from '../utils/errorHandler';
import { ModuleModel } from 'src/app/models/Module';

@Component({
  selector: 'app-add-module',
  templateUrl: './add-module.component.html',
  styleUrls: ['./add-module.component.scss']
})
export class AddModuleComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private moduleService: ModulesService,
    private toastr: ToastrService
  ) { }

  formNewModule: FormGroup;
  showLoader = false;
  @Output() closeAddModule = new EventEmitter();
  @Input() questionModule: ModuleModel;

  ngOnInit() {
    if (this.questionModule) {
      this.formNewModule = this.fb.group({
        title: [this.questionModule.title, Validators.required],
        max_wrong_questions: [this.questionModule.max_wrong_questions, Validators.required],
        minimun_questions: [this.questionModule.minimun_questions, Validators.required],
        video_link: [this.questionModule.video_link]
      });
    } else {
      this.formNewModule = this.fb.group({
        title: ['', Validators.required],
        max_wrong_questions: ['', Validators.required],
        minimun_questions: ['', Validators.required],
        video_link: ['']
      });
    }
  }

  close(canLoad) {
    this.formNewModule.value.title = '';
    this.formNewModule.value.max_wrong_questions = '';
    this.formNewModule.value.minimun_questions = '';
    this.formNewModule.value.video_link = '';
    this.closeAddModule.emit(canLoad);
  }

  save() {
    this.showLoader = true;
    let link = this.formNewModule.get('video_link').value;
    if (link && (link.includes('view?') || !link.includes('preview'))) {
      link = link.split('/');
      link[6] = 'preview';
      link = link.join('/');
    }
    this.formNewModule.get('video_link').setValue(link);
    if (this.formNewModule.valid) {
      if (this.questionModule) {
        this.moduleService.update(this.questionModule.id, this.formNewModule.value)
          .subscribe((questionModule: ModuleModel) => {
            this.showLoader = false;
            this.close(questionModule);
          }, (err: HttpErrorResponse) => {
            const errorHandler = new CustomErrorHandler();
            this.toastr.error(errorHandler.handlerHttpError(err));
          });
      } else {
        this.moduleService.save(this.formNewModule.value)
          .subscribe((questionModule: any) => {
            this.showLoader = false;
            this.toastr.success(`O módulo <strong>${questionModule.title}</strong> foi cadastrado com sucesso! :D`);
            this.close(questionModule);
          }, (err: HttpErrorResponse) => {
            const errorHandler = new CustomErrorHandler();
            this.showLoader = false;
            this.toastr.error(errorHandler.handlerHttpError(err));
            this.close(false);
          });
      }
    } else {
      this.showLoader = false;
      this.toastr.error('Verifique se o campo foi preenchido corretamente.');
    }
  }

}
