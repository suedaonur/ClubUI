import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ClubService } from '../../../core/services/club.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-create-club',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './create-club.component.html',
  styleUrl: './create-club.component.css'
})
export class CreateClubComponent {
  private clubService = inject(ClubService);
  private authService = inject(AuthService);
  private router = inject(Router);

  clubData = {
    name: '',
    description: ''
  };

  isSubmitting = false;

  onSubmit() {
    if (!this.clubData.name.trim() || !this.clubData.description.trim()) {
      alert("Lütfen tüm alanları doldurun!");
      return;
    }

    const currentStudent = this.authService.currentUser();
    if (!currentStudent || !currentStudent.id) {
      alert("Kulüp oluşturabilmek için giriş yapmalısınız!");
      this.router.navigate(['/login']);
      return;
    }

    this.isSubmitting = true;
    const payload = {
      name: this.clubData.name,
      description: this.clubData.description,
      presidentId: currentStudent.id
    };

    this.clubService.createClub(payload).subscribe({
      next: (clubId) => {
        alert("Kulüp başarıyla oluşturuldu! Artık bu kulübün kurucusu ve yöneticisisiniz. 🎉");
        this.isSubmitting = false;
        this.router.navigate(['/clubs', clubId]); // Oluşturulan kulübün detayına yönlendir
      },
      error: (err) => {
        console.error("Kulüp oluşturulamadı", err);
        alert("Kulüp oluşturulurken bir hata meydana geldi.");
        this.isSubmitting = false;
      }
    });
  }
}
