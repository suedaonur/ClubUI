import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // ngIf için
import { FormsModule } from '@angular/forms'; // 👈 ngModel hatasını bu çözer
import { Router } from '@angular/router';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-fake-obs',
  standalone: true, // 👈 Standalone yapı
  imports: [CommonModule, FormsModule], // 👈 FormsModule buraya gelmeli!
  templateUrl: './fake-obs.component.html',
  styleUrls: ['./fake-obs.component.css']
})
// fake-obs.component.ts
export class FakeObsComponent {
  studentNumber: string = '';

  constructor(private studentService: StudentService, private router: Router) {}

  onVerify() {
    this.studentService.verifyObs(this.studentNumber).subscribe({
      next: (res) => {
        alert("OBS Onayı Alındı. Sisteme aktarılıyorsunuz...");
        this.router.navigate(['/home']); 
      },
      error: (err) => {
        alert("Öğrenci bulunamadı! Giriş sayfasına yönlendiriliyorsunuz.");
        this.router.navigate(['/login']);
      }
    });
  }

  // 👈 EKSİK OLAN METOT BUYDU, BUNU EKLE:
  cancel() {
    // Kullanıcı vazgeçerse login sayfasına geri gönderiyoruz
    this.router.navigate(['/login']);
  }
}