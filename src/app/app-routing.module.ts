import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { ModulesComponent } from './components/modules/modules.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { QuestionsComponent } from './components/questions/questions.component';
import { QuestionImagesComponent } from './components/question-images/question-images.component';
import { ModuleComponent } from './components/module/module.component';
import { DashComponent } from './components/dash/dash.component';
import { SignupComponent } from './components/signup/signup.component';
import { UsersComponent } from './components/users/users.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { AnswerComponent } from './components/dash/answer/answer.component';
import { ForgotPwdComponent } from './components/forgot-pwd/forgot-pwd.component';
import { ModulePresentationComponent } from './components/dash/module-presentation/module-presentation.component';
import { UserGuard } from './auth/user.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'admin', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'home', component: DashComponent, canActivate: [UserGuard] },
  { path: 'answer', children: [
    { path: ':id', component: AnswerComponent, canActivate: [UserGuard] }
  ] },
  { path: 'modules', children: [
    { path: '', component: ModulesComponent, canActivate: [AuthGuard] },
    { path: ':id', component: ModuleComponent, canActivate: [AuthGuard] }
  ] },
  { path: 'questions', component: QuestionsComponent, canActivate: [AuthGuard] },
  { path: 'images', component: QuestionImagesComponent, canActivate: [AuthGuard] },
  { path: 'users', children: [
    { path: '', component: UsersComponent, canActivate: [AuthGuard] },
    { path: ':id', component: UserDetailsComponent, canActivate: [AuthGuard] }
  ] },
  { path: 'module-presentation/:id', component: ModulePresentationComponent, canActivate: [UserGuard] },
  { path: 'forgotpwd', component: ForgotPwdComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
