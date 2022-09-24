import { Component, OnInit } from '@angular/core';
import { QuestionsService } from 'src/app/services/questions.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomErrorHandler } from '../shared/utils/errorHandler';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {

  constructor(
    private questionsService: QuestionsService,
    private toastr: ToastrService
  ) { }
  showLoader = false;
  questions = [];
  page = 1;
  totalItems;
  showAddQuestion = false;
  selectedQuestion;

  ngOnInit() {
    this.getQuestions();
  }

  getQuestions() {
    this.showLoader = true;
    this.questionsService.getAll(this.page)
      .subscribe((response: any) => {
        this.questions = response.data;
        this.page = response.page;
        this.totalItems = response.total;
        this.showLoader = false;
      }, (err: HttpErrorResponse) => {
        const errorHandler = new CustomErrorHandler();
        this.toastr.error(errorHandler.handlerHttpError(err));
        this.showLoader = false;
      });
  }

  // { id: 1, type: 'dissertation' },
  // { id: 2, type: 'image-relation' },
  // { id: 3, type: 'word-organization' }
  // { id: 4, type: 'alternative' },
  // { id: 5, type: 'sound listening' }
  getType(type: number) {
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

  editQuestion(question) {
    this.selectedQuestion = question;
    this.showAddQuestion = true;
  }

  delete(question) {
    const canDelete = window.confirm('Você deseja realmente remover esta questão?');
    if (canDelete) {
      this.showLoader = true;
      this.questionsService.deleteQuestion(question.id)
        .subscribe(response => {
          this.showLoader = false;
          this.toastr.success('Questão removida com sucesso.');
          this.questions = this.questions.filter(q => {
            return q.id !== question.id;
          });
        }, (err: HttpErrorResponse) => {
          const errorHandler = new CustomErrorHandler();
          this.toastr.error(errorHandler.handlerHttpError(err));
          this.showLoader = false;
        });
    }
  }

  changePage(e: number) {
    this.showLoader = true;
    this.questionsService.getAll(e)
      .subscribe((response: any) => {
        this.questions = response.data;
        this.page = response.page;
        this.totalItems = response.total;
        this.showLoader = false;
      }, (err: HttpErrorResponse) => {
        const errorHandler = new CustomErrorHandler();
        this.toastr.error(errorHandler.handlerHttpError(err));
        this.showLoader = false;
      });
  }

  closeAddQuestion(e: Event) {
    this.showAddQuestion = false;
    if (e) {
      this.getQuestions();
    }
  }

}
