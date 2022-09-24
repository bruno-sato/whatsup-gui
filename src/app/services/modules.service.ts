import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ModuleModel } from '../models/Module';

@Injectable({
  providedIn: 'root'
})
export class ModulesService {

  constructor(
    private http: HttpClient
  ) { }

  getAll(page: number) {
    return this.http.get(`${environment.root}/modules?page=${page}`);
  }

  getOne(id: number) {
    return this.http.get(`${environment.root}/modules/${id}`);
  }

  save(questionModule: ModuleModel) {
    return this.http.post(`${environment.root}/modules`, {
      title: questionModule.title,
      minQuestions: questionModule.minimun_questions,
      maxQuestions: questionModule.max_wrong_questions
    });
  }

  delete(id: number) {
    return this.http.delete(`${environment.root}/modules/${id}`);
  }

  update(moduleId: number, questionModule: ModuleModel) {
    return this.http.put(`${environment.root}/modules/${moduleId}`, {
      title: questionModule.title,
      maxQuestions: questionModule.max_wrong_questions,
      minQuestions: questionModule.minimun_questions,
      videoLink: questionModule.video_link
    });
  }
}
