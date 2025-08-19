import { Routes, Router } from '@angular/router';
import { inject } from '@angular/core';
import { authGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'employees',
        loadComponent: () =>
          import('./components/employee-list/employee-list.component').then(
            (m) => m.EmployeeListComponent
          ),
      },
      {
        path: 'departments',
        loadComponent: () =>
          import('./components/department-list/department-list.component').then(
            (m) => m.DepartmentListComponent
          ),
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (m) => m.LoginComponent
      ),
    canActivate: [
      () => {
        const authService = inject(AuthService);
        const router = inject(Router);

        return authService.isLoggedIn()
          ? router.createUrlTree(['/dashboard'])
          : true;
      },
    ],
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
  {
    path: '**',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
    ],
  },
];
