import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-module-presentation',
  templateUrl: './module-presentation.component.html',
  styleUrls: ['./module-presentation.component.scss']
})
export class ModulePresentationComponent implements OnInit {

  videoUrl;
  moduleId;

  constructor(
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.moduleId = this.router.url.split('/')[2];
    const modules = JSON.parse(sessionStorage.getItem('modules'));
    modules.forEach(questionModule => {
      if (questionModule.id === parseInt(this.moduleId, 10)) {
        if (!questionModule.video_link) {
          this.goToQuestions();
        }
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(questionModule.video_link);
        return false;
      }
    });
  }

  goToQuestions() {
    this.router.navigate([`/answer/${this.moduleId}`]);
  }

}
