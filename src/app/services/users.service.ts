import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getAll(page: number): Observable<any> {
    return this.http.get(`${environment.root}/users?page=${page}`);
  }

  getUser(userId: number): Observable<any> {
    return this.http.get(`${environment.root}/users/${userId}`);
  }

  setModule(userId: number, moduleId: number): Observable<any> {
    return this.http.post(`${environment.root}/userModules`, { userId: userId, moduleId: moduleId });
  }

  getUserModules(): Observable<any> {
    return this.http.get(`${environment.root}/userModules`);
  }

  inactiveUser(userId: number) {
    return this.http.post(`${environment.root}/inactiveUser`, { userId: userId });
  }

  activateUser(userId: number) {
    return this.http.post(`${environment.root}/activateUser`, { userId: userId });
  }

  getAnsweredQuestions(userId: number) {
    return this.http.get(`${environment.root}/userQuestionsCount/${userId}`);
  }

  getPwdCode(email: string) {
    return this.http.post(`${environment.root}/resetpwd`, {userEmail: email});
  }

  saveNewPwd(email: string, newPwd: string) {
    return this.http.post(`${environment.root}/savepwd`, {
      userEmail: email, newPwd: newPwd
    });
  }

  getUsersCount() {
    return this.http.get(`${environment.root}/getUsersCount`);
  }

  setUserAsAdmin(userId: number) {
    return this.http.post(`${environment.root}/setUserAsAdmin`, {userId: userId});
  }

  getWorstStudents() {
    return this.http.get(`${environment.root}/worstStudents`);
  }
}
