import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { LoginService } from './services/login.service';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ModulesComponent } from './components/modules/modules.component';
import { Interceptor } from './services/interceptor.module';
import { LoaderComponent } from './components/shared/loader/loader.component';
import { AddModuleComponent } from './components/shared/add-module/add-module.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { SignupComponent } from './components/signup/signup.component';
import { AddQuestionComponent } from './components/shared/add-question/add-question.component';
import { QuestionsComponent } from './components/questions/questions.component';
import { QuestionImagesComponent } from './components/question-images/question-images.component';
import { AddImageComponent } from './components/shared/add-image/add-image.component';
import { ModuleComponent } from './components/module/module.component';
import { SelectImageComponent } from './components/shared/select-image/select-image.component';
import { DashComponent } from './components/dash/dash.component';
import { UsersComponent } from './components/users/users.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AnswerComponent } from './components/dash/answer/answer.component';
import { ModalModule } from 'ngx-bootstrap';
import { ChartsModule } from 'ng2-charts';
import { ForgotPwdComponent } from './components/forgot-pwd/forgot-pwd.component';
import { ModulePresentationComponent } from './components/dash/module-presentation/module-presentation.component';
import { UserGuard } from './auth/user.guard';
import { OrderModule } from 'ngx-order-pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavbarComponent,
    ModulesComponent,
    LoaderComponent,
    AddModuleComponent,
    PageNotFoundComponent,
    SignupComponent,
    AddQuestionComponent,
    QuestionsComponent,
    QuestionImagesComponent,
    AddImageComponent,
    ModuleComponent,
    SelectImageComponent,
    DashComponent,
    UsersComponent,
    UserDetailsComponent,
    AnswerComponent,
    ForgotPwdComponent,
    ModulePresentationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      enableHtml: true,
      closeButton: true
    }),
    Interceptor,
    NgxPaginationModule,
    FormsModule,
    InfiniteScrollModule,
    ModalModule.forRoot(),
    ChartsModule,
    OrderModule
  ],
  providers: [
    AuthGuard,
    UserGuard,
    LoginService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
