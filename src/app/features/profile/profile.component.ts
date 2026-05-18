import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; 
import { AuthService } from '../../core/services/auth.service';
import { ClubService } from '../../core/services/club.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink], 
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);
  clubService = inject(ClubService);
  
  user = this.authService.currentUser;
  myMemberships: any[] = [];

  ngOnInit(): void {
    this.loadUserClubs();
  }

  loadUserClubs() {
    const studentId = this.user()?.id;
    if (studentId) {
      this.clubService.getMyClubs(studentId).subscribe({
        next: (data) => {
          this.myMemberships = data;
        },
        error: (err) => {
          console.error("Profil kulüpleri çekilemedi:", err);
        }
      });
    }
  }

  logout() {
    this.authService.logout();
  }
}