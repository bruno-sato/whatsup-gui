import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModulesService } from 'src/app/services/modules.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomErrorHandler } from '../shared/utils/errorHandler';
import { QuestionsService } from 'src/app/services/questions.service';

@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.scss']
})
export class ModuleComponent implements OnInit {

  constructor(
    private router: Router,
    private modulesService: ModulesService,
    private toastr: ToastrService,
    private questionService: QuestionsService
  ) { }

  showLoader = true;
  questionModule;
  showModalAdd = false;
  showAddQuestion = false;
  selectedQuestion;
  edit = false;
  title;

  ngOnInit() {
    this.modulesService.getOne(parseInt(this.router.url.split('/')[2], 10))
      .subscribe(response => {
        this.questionModule = response;
        this.title = this.questionModule.title;
        this.showLoader = false;
      }, (err: HttpErrorResponse) => {
        const errorHandler = new CustomErrorHandler();
        this.showLoader = false;
        this.toastr.error(errorHandler.handlerHttpError(err));
      });
  }

  editQuestion(question) {
    this.questionService.getQuestion(question.id).subscribe(response => {
      this.selectedQuestion = response;
      this.showAddQuestion = true;
    }, err => {
      this.toastr.error('Error when get the question.');
    });
  }

  closeAddQuestion(e) {
    this.showAddQuestion = false;
    if (e) {
      this.modulesService.getOne(this.questionModule.id).subscribe(data => {
        this.questionModule = data;
      });
    }
    this.selectedQuestion = undefined;
  }

  closeModalAdd(e: Event) {
    this.showModalAdd = false;
    if (e) {
      this.questionModule = e;
    }
  }

  deleteQuestion(question, questionModule) {
    const confirmDelete = window.confirm('Deseja realmente deletar essa questão?');
    if (confirmDelete) {
      this.showLoader = true;
      this.questionService.deleteQuestion(question.id)
        .subscribe(response => {
          this.showLoader = false;
          questionModule.questions = questionModule.questions.filter(q => {
            return q.id !== question.id;
          });
          this.toastr.success('Questão excluida com sucesso!');
        }, (err: HttpErrorResponse) => {
          const errorHandler = new CustomErrorHandler();
          this.showLoader = false;
          this.toastr.error(errorHandler.handlerHttpError(err));
        });
    }
  }

  save() {
    if (this.title) {
      this.showLoader = true;
      this.modulesService.update(this.questionModule.id, this.title)
        .subscribe(response => {
          this.toastr.success('Módulo atualizado com sucesso.');
          this.questionModule.title = this.title;
          this.showLoader = false;
          this.edit = false;
        }, (err: HttpErrorResponse) => {
          const errorHandler = new CustomErrorHandler();
          this.showLoader = false;
          this.edit = false;
          this.toastr.error(errorHandler.handlerHttpError(err));
        });
    }
  }

  getQuestionType(type: number) {
    switch (type) {
      case 1:
        return 'Dissertativa';
      case 2:
        return 'Relação de palavra e imagem';
      case 4:
        return 'Alternativa';
      case 5:
        return 'Sound listening';
      default:
        return 'Organização de palavras';
    }
  }

}
