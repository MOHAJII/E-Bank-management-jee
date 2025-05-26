import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './navbar.component.html',
  standalone: true,
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  username: string = '';

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    // Subscribe to auth state changes
    this.authService.authState$.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.username = this.authService.username;
      } else {
        this.username = '';
      }
    });

    // Initialize username if already authenticated
    if (this.authService.isAuthenticated) {
      this.username = this.authService.username;
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
