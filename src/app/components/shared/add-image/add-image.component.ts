import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { QuestionsService } from 'src/app/services/questions.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomErrorHandler } from '../utils/errorHandler';

@Component({
  selector: 'app-add-image',
  templateUrl: './add-image.component.html',
  styleUrls: ['./add-image.component.scss']
})
export class AddImageComponent implements OnInit {

  @ViewChild('fileInput') fileInput;
  @Output() closeAddImage = new EventEmitter();
  files = [];
  showLoader = false;

  constructor(
    private questionsService: QuestionsService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
  }

  close(success: boolean) {
    this.closeAddImage.emit(success);
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.files = event.target.files;
    }
  }

  save() {
    this.showLoader = true;
    const input = new FormData();
    for (let i = 0; i < this.files.length; i++) {
      input.append('question_images', this.files[i]);
    }
    this.questionsService.saveImage(input)
      .subscribe(data => {
        this.showLoader = false;
        this.toastr.success('Imagens salvas com sucesso');
        this.close(true);
      }, (err: HttpErrorResponse) => {
        const errorHandler = new CustomErrorHandler();
        this.showLoader = false;
        this.toastr.error(errorHandler.handlerHttpError(err));
      });
  }

}
