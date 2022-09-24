import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  constructor(
    private http: HttpClient
  ) { }

  getAll(page: number) {
    return this.http.get(`${environment.root}/questions?page=${page}`);
  }

  getAllImages(page: number) {
    return this.http.get(`${environment.root}/questions/images?page=${page}`);
  }

  saveImage(images) {
    return this.http.post(`${environment.root}/questions/images`, images);
  }

  saveQuestion(question) {
    return this.http.post(`${environment.root}/questions`, question);
  }

  deleteQuestionImage(imageId: number) {
    return this.http.delete(`${environment.root}/questions/images/${imageId}`);
  }

  deleteQuestion(questionId: number) {
    return this.http.delete(`${environment.root}/questions/${questionId}`);
  }

  updateQuestion(questionId, question) {
    return this.http.put(`${environment.root}/questions/${questionId}`, question);
  }

  getQuestionsForUser(moduleId: string) {
    return this.http.get(`${environment.root}/userQuestions?moduleId=${moduleId}`);
  }

  getAnsweredQuestions(moduleId: string) {
    return this.http.get(`${environment.root}/userAnswer?moduleId=${moduleId}`);
  }

  getQuestion(questionId: string) {
    return this.http.get(`${environment.root}/questions/${questionId}`);
  }

  setAnswer(moduleId: number, questionId: number, correct: boolean) {
    return this.http.post(`${environment.root}/userAnswer`, {
      questionId: questionId, moduleId: moduleId, correct: correct
    });
  }

  sendMail(questionModule: string, utilization: string, status: string) {
    return this.http.post(`${environment.root}/userAnswer/sendMail`, {
      questionModule: questionModule, utilization: utilization, status: status
    });
  }

  getImages(imageId: string) {
    return this.http.get(`${environment.root}/questions/images/${imageId}`);
  }

  tryAgain(moduleId) {
    return this.http.post(`${environment.root}/userAnswer/tryAgain`, {
      moduleId: moduleId
    });
  }

  setModuleStatus(moduleId, status) {
    return this.http.post(`${environment.root}/moduleStatus`, {
      moduleId: moduleId,
      status: status
    });
  }

  getModuleStatus() {
    return this.http.get(`${environment.root}/moduleStatus`);
  }
}
