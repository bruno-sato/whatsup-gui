import { Component, OnInit } from '@angular/core';
import { QuestionsService } from 'src/app/services/questions.service';
import { ToastrService } from 'ngx-toastr';
import { CustomErrorHandler } from '../shared/utils/errorHandler';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-question-images',
  templateUrl: './question-images.component.html',
  styleUrls: ['./question-images.component.scss']
})
export class QuestionImagesComponent implements OnInit {

  constructor(
    private questionsService: QuestionsService,
    private toastr: ToastrService
  ) { }

  images = [];
  page = 1;
  totalItems;
  showAddImage = false;
  showLoader = false;

  getImages(page) {
    this.questionsService.getAllImages(page)
      .subscribe((response: any) => {
        this.images = response.data;
        this.page = response.page;
        this.totalItems = response.total;
        this.showLoader = false;
      }, (err: HttpErrorResponse) => {
        const errorHandler = new CustomErrorHandler();
        this.showLoader = false;
        this.toastr.error(errorHandler.handlerHttpError(err));
      });
  }

  ngOnInit() {
    this.showLoader = true;
    this.getImages(this.page);
  }

  getImagePath(imageName: string): string {
    return `${environment.imageRoot}/images/${imageName}`;
  }

  delete(image) {
    const canDelete = window.confirm('Deseja realmente excluir essa imagem.');
    if (canDelete) {
      this.showLoader = true;
      this.questionsService.deleteQuestionImage(image.id)
        .subscribe(response => {
          this.toastr.success('Imagem apagada com sucesso.');
          this.images = this.images.filter(im => {
            return im.id !== image.id;
          });
          this.showLoader = false;
        }, (err: HttpErrorResponse) => {
          const errorHandler = new CustomErrorHandler();
          this.showLoader = false;
          this.toastr.error(errorHandler.handlerHttpError(err));
        });
    }
  }

  changePage(e: number) {
    this.showLoader = true;
    this.getImages(e);
  }

  closeAddImage(e: Event) {
    this.showAddImage = false;
    if (e) {
      this.getImages(this.page);
    }
  }

}
