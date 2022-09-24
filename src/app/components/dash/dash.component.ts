import { Component, OnInit, TemplateRef, ComponentFactoryResolver } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { Route, Router } from '@angular/router';
import { QuestionsService } from 'src/app/services/questions.service';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { OrderPipe } from 'ngx-order-pipe';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss'],
})
export class DashComponent implements OnInit {

  _MODULE_INCOMPLETED = 'wrong';
  _MODULE_COMPLETED = 'full';
  modalRef: BsModalRef;
  modules;
  selectedModule;
  query = 'title';

  constructor(
    private userService: UsersService,
    private questionService: QuestionsService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private orderPipe: OrderPipe
  ) { }

  ngOnInit() {
    this.getModules();
  }

  getModules() {
    this.userService.getUserModules().subscribe(res => {
      this.modules = [];
      res.modules.forEach(userModule => {
        this.questionService.getQuestionsForUser(userModule.id)
        .subscribe((moduleQuestions: any[]) => {
          userModule.questions = moduleQuestions;
          this.questionService.getAnsweredQuestions(userModule.id)
          .subscribe((data: any[]) => {
            const wrongAnswers = data.filter(item => !item.correct);
            const corrrectAnswer = data.filter(item => item.correct);
            userModule.userAnswers = data;
            userModule.progress = this.checkProgress(data);
            userModule.progressBar = this.setProgressBar(data.length, moduleQuestions.length);
            userModule.started = true;
            userModule.status = this.checkStatus(data, moduleQuestions.length);
            if (data.length === 0) {
              userModule.started = false;
              userModule.progress = '0%';
            }
            this.modules.push(userModule);
            this.modules = this.orderPipe.transform(res.modules, 'title');
            sessionStorage.setItem('modules', JSON.stringify(this.orderPipe.transform(res.modules, 'title')));
          });
        });
      });
    });
  }

  private checkStatus(answers: any[], questionsLength): string {
    const progress = this.checkProgress(answers);
    const answerAll = this.setProgressBar(answers.length, questionsLength) === '100%';
    if (answerAll) {
      return progress === '100%' ? this._MODULE_COMPLETED : this._MODULE_INCOMPLETED;
    }
    return '';
  }

  private setProgressBar(answersLength: number, questionsLength): string {
    if (answersLength === 0) {
      return '0%';
    }
    const progress = (answersLength / questionsLength) * 100;
    return `${progress > 100 ? 100 : progress}%`;
  }

  private checkProgress(answers: any[]): string {
    const correct = answers.filter(answer => {
      return answer.correct;
    });
    const progress = (correct.length / answers.length) * 100;
    return `${progress > 100 ? 100 : progress.toFixed()}%`;
  }

  closeModal(template: TemplateRef<any>) {
    this.modalRef.hide();
  }

  answerQuestions(questionModule, template: TemplateRef<any>) {
    this.selectedModule = questionModule;
    sessionStorage.setItem('selectedModule', JSON.stringify(this.selectedModule));
    if (questionModule.progressBar === '0%' && questionModule.video_link) {
      this.router.navigate([`module-presentation/${questionModule.id}`]);
      return;
    } else if (questionModule.progressBar !== '100%') {
      this.router.navigate([`/answer/${questionModule.id}`]);
      return;
    } else {
      this.modalRef = this.modalService.show(template);
      return;
    }
  }

  restartModule(template: TemplateRef<any>) {
    this.questionService.tryAgain(this.selectedModule.id)
      .subscribe(data => {
        this.modalRef.hide();
        this.selectedModule.userAnswers = [];
        sessionStorage.setItem('selectedModule', JSON.stringify(this.selectedModule));
        this.router.navigate([`/answer/${this.selectedModule.id}`]);
      }, err => {
        this.toastr.error('An error has ocurred');
        this.modalRef.hide();
      });
  }

}
