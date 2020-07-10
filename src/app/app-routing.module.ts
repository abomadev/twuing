import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LandingPageComponent } from './landing-page-shell/landing-page/landing-page.component';
import { LandingPageShellComponent } from './landing-page-shell/landing-page-shell.component';
import { AuthGuard } from './auth/auth.guard';


const routes: Routes = [
  {path: '', component: LandingPageShellComponent, children: [
    {path: '', component: LandingPageComponent},
  ]},
  {path: 'app', component: HomeComponent, canActivate: [AuthGuard]},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
