import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  // Backend URL: environment içindeki apiUrl + endpoint
  private endpoint = `${environment.apiUrl}/Students/verify-obs`;

  constructor(private http: HttpClient) { }

  verifyObs(studentNumber: string): Observable<any> {
    // Backend'e studentNumber gönderiyoruz
    return this.http.post(this.endpoint, { studentNumber }).pipe(
      tap((res: any) => {
        // Eğer backend'den başarılı (true veya success) bir sonuç dönerse
        // Tarayıcı hafızasına "onaylandı" bilgisini yazıyoruz
        if (res) {
          sessionStorage.setItem('obs_verified', 'true');
        }
      })
    );
  }

  // Bekçinin (Guard) kontrol edeceği metod
  checkVerificationStatus(): boolean {
    // Tarayıcıda 'obs_verified' bilgisi 'true' ise geçişe izin ver
    return sessionStorage.getItem('obs_verified') === 'true';
  }

  // Çıkış yapıldığında veya iptal edildiğinde temizlemek için
  clearVerification() {
    sessionStorage.removeItem('obs_verified');
  }
}