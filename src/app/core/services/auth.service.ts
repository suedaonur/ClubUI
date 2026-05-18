import { Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Uygulama her açıldığında buradan kullanıcıyı takip edecek (Signal yapısı)
  currentUser = signal<User | null>(null);

  constructor(private router: Router) {
    this.loadUserFromStorage();
  }

  // Kullanıcı bilgilerini ve Token'ı tarayıcıya kaydet
  saveUser(user: User) {
    // SİHİRLİ DOKUNUŞ: Ekstra paket kurmadan token'ı çözüp ID'yi içinden alıyoruz
    const decodedToken = this.decodeToken(user.token);
    
    if (decodedToken) {
      // Uzun claim adreslerinden ID ve Öğrenci numarasını çekip User nesnesine ekliyoruz
      const extractedId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
      user.id = extractedId ? Number(extractedId) : undefined;
      user.studentNumber = decodedToken['StudentNumber'];
    }

    localStorage.setItem('club_user', JSON.stringify(user));
    this.currentUser.set(user);
  }

  private loadUserFromStorage() {
    const data = localStorage.getItem('club_user');
    if (data) {
      this.currentUser.set(JSON.parse(data));
    }
  }

  logout() {
    localStorage.removeItem('club_user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.currentUser()?.token || null;
  }

  // NPM paketi kullanmadan JWT çözen gizli metodumuz
  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }
}