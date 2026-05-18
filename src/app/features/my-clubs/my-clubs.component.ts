import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClubService } from '../../core/services/club.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-my-clubs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-clubs.component.html',
  styleUrl: './my-clubs.component.css'
})
export class MyClubsComponent implements OnInit {
  myClubs: any[] = [];
  isLoading: boolean = true;

  clubService = inject(ClubService);
  authService = inject(AuthService);

  ngOnInit(): void {
    this.loadMyClubs();
  }

  loadMyClubs() {
    const studentId = this.authService.currentUser()?.id;

    if (!studentId) {
      this.isLoading = false;
      return;
    }

    this.clubService.getMyClubs(studentId).subscribe({
      next: (data) => {
        this.myClubs = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Kulüplerim yüklenirken hata oluştu:", err);
        this.isLoading = false;
      }
    });
  }
} 