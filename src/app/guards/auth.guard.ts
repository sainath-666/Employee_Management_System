import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();

  if (token) {
    return true;
  }

  // Only redirect to login if not already on login page
  if (!router.url.includes('/login')) {
    router.navigate(['/login']);
  }
  return false;
};
