import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { NavbarComponent } from './layout/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent], 
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(public router: Router) {} 
}