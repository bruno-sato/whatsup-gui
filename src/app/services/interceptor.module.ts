import { NgModule, Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()

export class HttpsRequestInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const user = JSON.parse(sessionStorage.getItem('wpp_user'));
    if (user) {
      const dupReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${user.token}`),
      });
      return next.handle(dupReq);
    } else {
      return next.handle(req);
    }
  }
}


@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpsRequestInterceptor,
      multi: true,
    },
  ],
})


export class Interceptor {}
