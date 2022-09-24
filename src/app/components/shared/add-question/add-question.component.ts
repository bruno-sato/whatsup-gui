import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { QuestionsService } from 'src/app/services/questions.service';
import { environment } from 'src/environments/environment';
import { TypeaheadOptions } from 'ngx-bootstrap';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss']
})
export class AddQuestionComponent implements OnInit {

  formQuestion: FormGroup;
  selectModule = false;
  modules = [];
  type = -1;
  alternative = '';
  alternatives = [];
  images = [];
  image;
  showLoader = false;
  selectImage = false;

  @Input() module: number;
  @Input() question;
  @Output() closeAddQuestion = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private questionsService: QuestionsService
  ) {
  }

  ngOnInit() {
    if (this.question) {
      this.createForm(this.question);
      if (this.question.options) {
        this.question.options.forEach(alternative => {
          this.alternatives.push(alternative.option);
        });
      }
    } else {
      this.createForm();
    }
  }

  changeType(e: Event) {
    this.type = this.formQuestion.get('type').value;
  }

  closeImageSelect(e) {
    this.selectImage = false;
    if (e) {
      this.image = e;
      this.formQuestion.get('answer').setValue(this.image.imageName.split('.')[0]);
    }
  }

  getImagePath(imageName: string): string {
    return `${environment.root}/images/${imageName}`;
  }

  createForm(question?) {
    if (question) {
      this.type = question.type;
      if (question.option) {
        for (const option of question.options) {
          this.alternatives.push(option.option);
        }
      }
      this.formQuestion = this.fb.group({
        title: [question.title, Validators.required],
        question: [question.question, Validators.required],
        type: [question.type, Validators.required],
        answer: [question.answer, Validators.required],
        answerTime: [question.answer_time, Validators.required],
        britishAnswer: [question.answer_british],
        soundKey: [question.soundId]
      });
    } else {
      this.formQuestion = this.fb.group({
        title: ['', Validators.required],
        question: ['', Validators.required],
        type: ['', Validators.required],
        answer: ['', Validators.required],
        answerTime: ['', Validators.required],
        britishAnswer: [''],
        soundKey: [''],
      });
    }
  }

  addAlternative() {
    if (this.alternative) {
      this.alternatives.push(this.alternative);
      this.alternative = '';
    }
    return false;
  }

  removeAlternative(alternative) {
    const index = this.alternatives.indexOf(alternative);
    this.alternatives.splice(index, 1);
  }

  save() {
    this.showLoader = true;
    if (this.formQuestion.valid) {
      const question = {
        title: this.formQuestion.get('title').value,
        question: this.formQuestion.get('question').value,
        type: parseInt(this.formQuestion.get('type').value, 10),
        moduleId: this.module,
        answer: this.formQuestion.get('answer').value,
        britishAnswer: this.formQuestion.get('britishAnswer').value,
        answerTime: this.formQuestion.get('answerTime').value,
        soundId: this.formQuestion.get('soundKey').value
      };
      switch (parseInt(this.formQuestion.get('type').value, 10)) {
        case 2:
          if (!this.image && !this.question.image_id) {
            this.toastr.error('There is no image selected');
            this.showLoader = false;
            return false;
          }
          if (!this.image && this.question.image_id) {
            question['imageId'] = this.question.image_id;
            break;
          }
          question['imageId'] = this.image.id;
          break;
        case 3:
          question['phrase'] = question.answer;
          break;
        case 4:
          if (this.alternatives.length === 0) {
            this.showLoader = false;
            this.toastr.error('There is no options');
            return false;
          }
          if (this.image) {
            if (!this.image && !this.question.image_id) {
              this.toastr.error('There is no image selected');
              this.showLoader = false;
              return false;
            }
            if (!this.image && this.question.image_id) {
              question['imageId'] = this.question.image_id;
              question['options'] = this.alternatives;
              break;
            }
            question['imageId'] = this.image.id;
            question['options'] = this.alternatives;
            break;
          }
          question['options'] = this.alternatives;
          break;
        default:
          break;
      }
      if (this.question) {
        question.moduleId = this.question.module_id;
        this.questionsService.updateQuestion(this.question.id, question)
          .subscribe(data => {
            this.showLoader = false;
            this.toastr.success('Question updated');
            this.close(this.question);
          }, err => {
            this.showLoader = false;
            this.toastr.error('An error has ocurred');
            this.close(false);
          });
      } else {
        this.questionsService.saveQuestion(question)
          .subscribe(response => {
            this.showLoader = false;
            this.toastr.success('Question saved');
            this.close(response);
          }, err => {
            this.showLoader = false;
            this.toastr.error('An error has ocurred');
            this.close(false);
          });
      }
    } else {
      this.toastr.error('Verify if all fields are full filled');
      this.showLoader = false;
    }
  }

  close(success) {
    this.closeAddQuestion.emit(success);
  }

}
