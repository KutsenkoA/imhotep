import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from 'src/app/components/dashboard/dashboard.component';
import { TokenComponent } from 'src/app/components/token/token.component';
import { SwaggerComponent } from 'src/app/components/swagger/swagger.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [ AuthGuard ], children: [
      { path: ':sha', component: SwaggerComponent }
    ]},
  { path: 'token', component: TokenComponent },
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
