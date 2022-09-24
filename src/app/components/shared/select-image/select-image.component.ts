import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { QuestionsService } from 'src/app/services/questions.service';

@Component({
  selector: 'app-select-image',
  templateUrl: './select-image.component.html',
  styleUrls: ['./select-image.component.scss']
})
export class SelectImageComponent implements OnInit {

  constructor(
    private questionsService: QuestionsService
  ) { }

  images = [];
  page = 1;
  totalItems = 0;
  showLoader = false;
  @Output() closeImageSelect = new EventEmitter();
  selectedItem = '';

  ngOnInit() {
    this.getImages(this.page);
  }

  close(event) {
    this.closeImageSelect.emit(event);
  }

  getImages(page) {
    this.questionsService.getAllImages(page)
      .subscribe((response: any) => {
        this.images = response.data;
        this.totalItems = response.total;
        this.showLoader = false;
        this.page = response.page;
      }, err => {
        this.showLoader = false;
      });
  }

  selectItem(image) {
    this.selectedItem = image;
  }

  select() {
    this.close(this.selectedItem);
  }

  changePage(e: number) {
    this.showLoader = true;
    this.getImages(e);
  }

}
