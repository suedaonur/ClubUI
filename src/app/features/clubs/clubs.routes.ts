import { Routes } from '@angular/router';

export const CLUB_ROUTES: Routes = [
  { 
    path: '', // 'clubs' yazıncca  
    loadComponent: () => import('./clubs.component').then(c => c.ClubsComponent) 
  },
  { 
    path: 'create', // 'clubs/create'
    loadComponent: () => import('./create-club/create-club.component').then(c => c.CreateClubComponent) 
  },
  { 
    path: ':id', // 'clubs/5'
    loadComponent: () => import('./club-detail/club-detail.component').then(c => c.ClubDetailComponent) 
  }
];