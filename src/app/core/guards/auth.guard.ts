import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Kullanıcı giriş yapmış mı (Hafızada kullanıcı verisi var mı?)
  if (authService.currentUser()) {
    return true; // Giriş var, geçebilirsin
  }

  // Giriş yoksa Login sayfasına yönlendir
  router.navigate(['/login']);
  return false;
};