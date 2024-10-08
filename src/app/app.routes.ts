import { Routes } from '@angular/router';
import { HomeComponent } from './core/home/home.component';
import { TaskDetailComponent } from './core/task-detail/task-detail.component';
import { TaskEditComponent } from './core/task-edit/task-edit.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'details/:id',
    component: TaskDetailComponent,
  },
  {
    path: 'edit/:id',
    component: TaskEditComponent,
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
