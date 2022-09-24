import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { QuestionsService } from 'src/app/services/questions.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.scss']
})
export class AnswerComponent implements OnInit, OnDestroy {

  questions = [];
  answeredQuestions = [];
  module;

  answeredWrongQuestions = [];
  nextAnswer = [];
  moduleProgress = '0%';
  selectedQuestion;
  successAnswer;
  skippedQuestions = [];
  nextSkippedQuestion = 0;
  answerTime: number;
  clockSize: string;
  soundAnswer;
  soundLink: string;

  selectedImage ;
  dissertationAnswer = '';
  selectedOption;
  phraseAnswer = [];
  interval;
  correctAnswer: string;

  @ViewChild('sound')
  audioTag: HTMLAudioElement;

  constructor(
    private router: Router,
    private questionService: QuestionsService,
    private toastr: ToastrService
  ) { }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  ngOnInit() {
    const moduleId = this.router.url.split('/')[2];
    const modules = JSON.parse(sessionStorage.getItem('modules'));
    if (modules) {
      this.module = JSON.parse(sessionStorage.getItem('selectedModule'));
      if (this.module.userAnswers.length === 0) {
        this.answeredQuestions = [];
      } else {
        this.answeredQuestions = this.module.userAnswers.map(answer => answer.question_id);
      }
      this.questions = this.module.questions.filter(question => {
        return !this.answeredQuestions.includes(question.id);
      });
      sessionStorage.setItem('skippedQuestions', JSON.stringify([]));
      this.setProgress();
      this.checkProgress();
      this.getNextQuestion();
    }
  }

  setProgress() {
    this.moduleProgress = (this.answeredQuestions.length / this.module.minimun_questions * 100).toFixed(2) + '%';
    if (this.answeredQuestions.length === this.module.minimun_questions) {
      const correct = this.answeredQuestions.filter(answer => {
        return answer.correct;
      });
      const progress = (correct.length / this.answeredQuestions.length) * 100;
      const progressEmail = `${progress > 100 ? 100 : progress.toFixed()}%`;
      this.questionService.setModuleStatus(this.module.id, 1).subscribe(data => {});
      this.questionService.sendMail(this.module.title, progressEmail, 'completed')
        .subscribe(data => {
        });
      this.checkProgress();
      return;
    }
    if (this.answeredWrongQuestions.length === this.module.max_wrong_questions) {
      this.setModuleFail();
      return;
    }
  }

  checkProgress() {
    const skippedQuestions = JSON.parse(localStorage.getItem('skippedQuestions')) || [];
    if (this.answeredQuestions.length === this.module.minimun_questions) {
      this.toastr.error('You answered all questions in this module. Congratulations!');
      this.router.navigate(['/home']);
      return 0;
    } 
    else if (this.answeredWrongQuestions.length === this.module.max_wrong_questions) {
      this.toastr.error('You reached maximum wrong questions to this module. 😕');
      this.router.navigate(['/home']);
      return 0;
    } 
    else if (skippedQuestions.length === 0 && this.questions.length === 0) {
      this.toastr.warning('You answered all questions created in this module.');
      this.router.navigate(['/home']);
      return 0;
    }
  }

  selectImage(image) {
    this.selectedImage = image;
  }

  updateSkippedQuestions(skippedQuestions: any[]) {
    sessionStorage.setItem('skippedQuestions', JSON.stringify(skippedQuestions));
  }

  setNextAnswer() {
    if (this.questions.length) {
      this.nextAnswer.push(this.questions.shift());
    } else {
      const skippedQuestions: any[] = JSON.parse(sessionStorage.getItem('skippedQuestions'));
      if (skippedQuestions && skippedQuestions.length) {
        this.nextAnswer.push(skippedQuestions.shift());
        this.updateSkippedQuestions(skippedQuestions);
      }
    }
  }

  checkQuestion() {
    clearInterval(this.interval);
    switch (this.selectedQuestion.type) {
      case 2:
        if (this.selectedQuestion && this.selectedImage) {
          if (this.selectedImage['imageName'].split('.')[0].toLowerCase() === this.selectedQuestion.answer.toLowerCase()) {
            this.successAnswer = 1;
          } else {
            this.successAnswer = 2;
          }
        } else {
          this.successAnswer = 2;
        }
        break;
      case 3:
        if (this.selectedQuestion.answer.trim() &&
          this.phraseAnswer.map(answer => answer.prhase).join(' ').trim() === this.selectedQuestion.answer.trim()) {
          this.successAnswer = 1;
        } else {
          this.successAnswer = 2;
        }
        break;
      case 4:
        if (this.selectedOption.trim() && (this.selectedQuestion.answer.trim() === this.selectedOption.trim() ||
          this.selectedQuestion.answer_british.trim() === this.selectedOption.trim())) {
          this.successAnswer = 1;
        } else {
          this.successAnswer = 2;
        }
        break;
      case 5:
        this.soundLink = '';
        if (this.soundAnswer.trim() && (this.soundAnswer.toLowerCase().trim() === this.selectedQuestion.answer.toLowerCase().trim())) {
          this.successAnswer = 1;
        } else {
          this.successAnswer = 2;
        }
        break;
      default:
        this.dissertationAnswer = this.dissertationAnswer.replace('‘', "'").trim().toLowerCase();
        if (this.dissertationAnswer && (
          (this.selectedQuestion.answer.toLowerCase().trim() === this.dissertationAnswer) ||
          (this.selectedQuestion.answer_british.toLowerCase().trim() === this.dissertationAnswer))) {
          this.successAnswer = 1;
        } else {
          this.successAnswer = 2;
        }
        break;
    }
    this.correctAnswer = `${this.selectedQuestion.answer} ${this.selectedQuestion.answer_british ? 'or '+this.selectedQuestion.answer_british : ''}`;
    this.addAnsweredQuestion();
  }

  clearAnswers() {
    this.successAnswer = false;
    this.selectedImage = '';
    this.selectedOption = '';
    this.soundAnswer = '';
    this.dissertationAnswer = '';
    this.phraseAnswer = [];
  }

  addAnsweredQuestion() {
    this.questionService.setAnswer(this.module.id, this.selectedQuestion.id, this.successAnswer === 1 ? true : false)
      .subscribe((response: any) => {
        if (response.correct) {
          this.answeredQuestions.push(response);
        } else {
          this.answeredWrongQuestions.push(response);
          this.answeredQuestions.push(response);
        }
        this.module.userAnswers = this.answeredQuestions.map(answer => answer);
        sessionStorage.setItem('selectedModule', JSON.stringify(this.module));
      }, err => {
      });
  }

  setModuleFail() {
    this.questionService.setModuleStatus(this.module.id, 2)
      .subscribe(data => {});
    const correct = this.answeredQuestions.filter(answer => {
      return answer.correct;
    });
    const progress = (correct.length / this.answeredQuestions.length) * 100;
    const progressEmail = `${progress > 100 ? 100 : progress.toFixed()}%`;
    this.questionService.setModuleStatus(this.module.id, 1)
      .subscribe(data => {});
    this.questionService.sendMail(this.module.title, progressEmail, 'not completed')
      .subscribe(data => {
        this.checkProgress();
      });
  }

  skipQuestion() {
    clearInterval(this.interval);
    const skippedQuestions: any[] = JSON.parse(sessionStorage.getItem('skippedQuestions'));
    skippedQuestions.push(this.selectedQuestion);
    sessionStorage.setItem('skippedQuestions', JSON.stringify(skippedQuestions));
    this.getNextQuestion();
  }

  backToHome() {
    this.router.navigate(['/home']);
  }

  getNextQuestion() {
    this.checkProgress();
    this.setProgress();
    this.setNextAnswer();
    this.clearAnswers();
    this.questionService.getQuestion(this.nextAnswer.shift().id)
      .subscribe((response: any) => {
        this.selectedQuestion = response;
        this.answerTime = response.answer_time;
        this.clockSize = this.answerTime < 100 ? '30px' : '40px';
        switch (this.selectedQuestion.type) {
          case 2:
            this.getImages(this.selectedQuestion.image_id);
            break;
          case 3:
            const phraseArray = this.selectedQuestion.phrase.split(' ').map((prhase, index) => {
              return {index, prhase};
            });
            this.selectedQuestion.phrase = this.randomizeArray(phraseArray);
            break;
          case 5:
            this.soundLink = this.getSoundLink(this.selectedQuestion.soundId);
            break;
          default:
            break;
        }
      });
      this.interval = setInterval(() => {
        if (this.answerTime !== 0) {
          this.answerTime--;
        } else {
          this.checkQuestion();
        }
      }, 1000);
  }

  getOrder() {
    return `${Math.floor(Math.random() * 10)}`;
  }

  getSoundLink(soundPath: string): string {
    return 'http://docs.google.com/uc?export=open&id=' + soundPath.split('=')[1];
  }

  getImages(imageId: string) {
    this.questionService.getImages(imageId)
      .subscribe(response => {
        this.selectedQuestion.images = response;
      }, err => {
        console.error(err);
      });
  }

  getImagePath(imageName: string): string {
    return `${environment.imageRoot}/images/${imageName}`;
  }

  getCorrectImagePath(answer: string) {
    const selectedImage = this.selectedQuestion.images.other.filter(img => {
      return this.selectedQuestion.image_id === img.id;
    });
    if (this.selectedQuestion) {
      return `${environment.imageRoot}/images/${selectedImage[0].imageName}`;
    }
    return '';
  }

  selectOption(option: string) {
    this.selectedOption = option;
  }

  selectWordToPhrase(word: {index, prhase}) {
    const wordExists = this.phraseAnswer.findIndex(answer => answer.index === word.index);
    if (this.phraseAnswer.includes(word)) {
      this.phraseAnswer = this.phraseAnswer.filter(val => {
        if (val.index === word.index) {
          return false;
        }
        return true;
      });
    } else {
      this.phraseAnswer.push(word);
    }
  }

  randomizeArray(array) {
    return array.sort(function() {
      return .5 - Math.random();
    });
  }

  getPrhaseAnswer() {
    return this.phraseAnswer.map(answer => answer.prhase).join(' ');
  }
}
