import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginData = {
    studentNumber: '',
    password: ''
  };

  constructor(
    private router: Router, 
    private http: HttpClient, 
    private authService: AuthService
  ) {}

  onLogin() {
    this.http.post<any>(`${environment.apiUrl}/Students/login`, this.loginData).subscribe({
      next: (res) => {
        this.authService.saveUser(res); 
        this.router.navigate(['/home']); 
      },
      error: (err) => {
        alert("Giriş Başarısız! Lütfen öğrenci numaranızı ve şifrenizi kontrol edin.");
        console.error(err);
      }
    });
  }

  goToObsSystem() {
    this.router.navigate(['/fake-obs']);
  }
}