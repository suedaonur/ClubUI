import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StudentService } from './services/student.service'; // Relative path'e dikkat!

export const authGuard: CanActivateFn = (route, state) => {
  const studentService = inject(StudentService);
  const router = inject(Router);

  // Servis üzerinden durum kontrolü yapıyoruz
  if (studentService.checkVerificationStatus()) {
    return true; // Giriş izni ver
  } else {
    // Onay yoksa kullanıcıya bilgi ver ve Login sayfasına yönlendir
    alert("Bu sayfaya erişmek için önce OBS doğrulaması yapmalısınız!");
    router.navigate(['/login']);
    return false; // Geçişi engelle
  }
};