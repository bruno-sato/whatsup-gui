import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  sessionEvent: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private http: HttpClient
  ) { }

  login(email: string, pwd: string) {
    return this.http.post(`${environment.root}/login`, {
      email: email,
      password: pwd
    });
  }

  signup(username: string, email: string, pwd: string) {
    return this.http.post(`${environment.root}/users`, {
      username: username,
      email: email,
      password: pwd
    });
  }

  saveUser(user) {
    sessionStorage.setItem('wpp_user', user);
    this.sessionEvent.emit(true);
  }

  isLoged() {
    const user = this.getUser();
    if (user) {
      return true;
    }
    return false;
  }

  getUser() {
    return sessionStorage.getItem('wpp_user');
  }

  logout() {
    sessionStorage.removeItem('wpp_user');
    this.sessionEvent.emit(false);
  }

}
