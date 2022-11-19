import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ListTaskComponent } from './task/list-task/list-task.component';
import { AuthGuard } from './guard/auth.guard'
import { CreateTaskComponent } from './task/create-task/create-task.component';
import { ViewTaskComponent } from './task/view-task/view-task.component';
import { ManagerTaskComponent } from './task/manager-task/manager-task.component';

const routes: Routes = [ {
  path: '',
  component: LoginComponent,
  pathMatch: 'full'
},
{
  path: 'tasks/manager',
  component: ManagerTaskComponent,
  canActivate: [AuthGuard],
},
{
  path: 'tasks',
  component: ListTaskComponent,
  canActivate: [AuthGuard]
},
{
  path: 'create',
  component: CreateTaskComponent,
  canActivate: [AuthGuard]
},
{
    path: 'view',
    component: ViewTaskComponent,
    canActivate: [AuthGuard]
},
{
  path: 'login',
  component: LoginComponent
},
{
  path: 'tasks/manager/manager',
  redirectTo:'tasks/manager'
},
{
  path: 'view/manager',
  redirectTo:'tasks/manager'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
