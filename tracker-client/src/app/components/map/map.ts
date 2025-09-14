import { Component, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/userService/user-service';
import * as L from 'leaflet';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDivider
  ],
  templateUrl: './map.html',
  styleUrls: ['./map.css']
})
export class MapComponent implements AfterViewInit {
  loginUsername = '';
  loginPassword = '';
  regUsername = '';
  regFirstname = '';
  regLastname = '';
  regPassword = '';
  regPassword2 = '';
  regEmail = '';
  regEmail2 = '';

  constructor(private userService: UserService, private router: Router) {}

  ngAfterViewInit() {
    const map = L.map('generalMap').setView([48.2, 16.37], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker([48.2, 16.37]).addTo(map).bindPopup('Vienna').openPopup();

    setTimeout(() => {
      map.invalidateSize();
    }, 0);
  }

  onLogin() {
    this.userService.login(this.loginUsername, this.loginPassword).subscribe(user => {
      if (user) {
        this.userService.getUserId();
        localStorage.setItem('username', this.loginUsername);
        localStorage.setItem('userId', String(user.id));
        this.router.navigate(['/tracker']).then();
      } else {
        this.loginUsername = '';
        this.loginPassword = '';
        alert('Invalid username or password');
      }
    });
  }

  onRegister() {
    if (this.regUsername.length < 6) {
      alert("Username is too short!");
      return;
    }
    if (this.regPassword !== this.regPassword2 || this.regPassword.length < 7) {
      alert("Passwords do not match!");
      return;
    }
    if (this.regEmail !== this.regEmail2) {
      alert("Emails do not match!");
      return;
    }
    if (!this.isValidEmail(this.regEmail)) {
      alert("Invalid email format!");
      return;
    }

    const userData = {
      username: this.regUsername,
      firstname: this.regFirstname,
      lastname: this.regLastname,
      password: this.regPassword,
      email: this.regEmail,
      date: Date.now()
    };

    this.userService.register(userData).subscribe(result => {
      if (!result) {
        alert('Registration failed!');
        return;
      }
      alert('Registered! Please log in.');

      location.reload();
    });
  }


  private isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
}
