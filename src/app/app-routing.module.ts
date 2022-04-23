import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ResultComponent } from './components/profile/result/result.component';
import { SignupComponent } from './components/signup/signup.component';
import { UserdetailsComponent } from './components/userdetails/userdetails.component';
import { AuthGuard } from './guards/auth.guard';
import { NoauthGuard } from './guards/noauth.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'login',
    canActivate: [NoauthGuard],
    component: LoginComponent,
  },
  {
    path: 'signup',
    canActivate: [NoauthGuard],
    component: SignupComponent,
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    component: ProfileComponent,
  },
  {
    path: 'result/:id',
    canActivate: [AuthGuard],
    component: ResultComponent,
  },
  {
    path: 'userdetails/:id',
    canActivate: [AuthGuard],
    component: UserdetailsComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
