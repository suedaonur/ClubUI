import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClubService, Club } from '../../core/services/club.service';

@Component({
  selector: 'app-clubs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './clubs.component.html',
  styleUrl: './clubs.component.css'
})
export class ClubsComponent implements OnInit {
  clubs: Club[] = []; 
  isLoading: boolean = true;

  // Servisi modern yöntemle içeri alıyoruz
  clubService = inject(ClubService);

  ngOnInit(): void {
    this.fetchAllClubs();
  }

  fetchAllClubs() {
    this.clubService.getAllClubs().subscribe({
      next: (data) => {
        this.clubs = data;
        this.isLoading = false;
        console.log("Tüm kulüpler başarıyla çekildi:", data);
      },
      error: (err) => {
        console.error("Kulüpler yüklenirken hata oluştu!", err);
        this.isLoading = false;
      }
    });
  }
}