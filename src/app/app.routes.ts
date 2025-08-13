import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'employees',
    loadComponent: () =>
      import('./components/employee-list/employee-list.component').then(
        (m) => m.EmployeeListComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'employees/add',
    loadComponent: () =>
      import('./components/employee-form/employee-form.component').then(
        (m) => m.EmployeeFormComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'employees/edit/:id',
    loadComponent: () =>
      import('./components/employee-form/employee-form.component').then(
        (m) => m.EmployeeFormComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'departments',
    loadComponent: () =>
      import('./components/department-list/department-list.component').then(
        (m) => m.DepartmentListComponent
      ),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '/login' },
];
