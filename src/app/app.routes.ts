import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // --- AÇIK SAYFALAR ---
  { 
    path: 'login', 
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) 
  },
  { 
    path: 'fake-obs', 
    loadComponent: () => import('./features/fake-obs/fake-obs.component').then(m => m.FakeObsComponent) 
  },

  // --- KORUMALI SAYFALAR (authGuard eklendi) ---
  { 
    path: 'home', 
    canActivate: [authGuard], 
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  { 
    path: 'my-clubs', 
    canActivate: [authGuard], 
    loadComponent: () => import('./features/my-clubs/my-clubs.component').then(m => m.MyClubsComponent) 
  },
  { 
    path: 'profile', 
    canActivate: [authGuard], 
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent) 
  },
  { 
    path: 'admin/club/:id', 
    canActivate: [authGuard], 
    loadComponent: () => import('./features/admin/club-admin/club-admin.component').then(c => c.ClubAdminComponent) 
  },
  { 
    path: 'clubs', 
    canActivate: [authGuard], 
    loadChildren: () => import('./features/clubs/clubs.routes').then(r => r.CLUB_ROUTES) 
  },
  { 
    path: 'chatbot', 
    canActivate: [authGuard], 
    loadComponent: () => import('./features/chatbot/chatbot.component').then(m => m.ChatbotComponent) 
  },

  // --- YÖNLENDİRMELER ---
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' } 
];
