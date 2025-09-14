import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import {MatButton, MatButtonModule} from '@angular/material/button';
import {UserService} from '../../services/userService/user-service';
import {User} from '../../models/user';

const iconRetinaUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png';
const iconUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png';
const shadowUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

@Component({
  selector: 'app-tracker',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './tracker.html',
  styleUrls: ['./tracker.css']
})
export class TrackerComponent implements AfterViewInit {
  latitude: number | null = null;
  longitude: number | null = null;
  map: any;
  username: string | null = null;
  apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient, private router: Router, private userService: UserService) {
    this.userService.user$.subscribe((user: User | undefined) => {
      this.username = user?.username ?? null;
    });
  }

  ngAfterViewInit() {
    this.map = L.map('map').setView([48.2, 16.37], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    setTimeout(() => {
      this.map.invalidateSize();
    }, 0);

    this.getLocation().then();
  }

  getLocation(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            this.latitude = pos.coords.latitude;
            this.longitude = pos.coords.longitude;

            this.map.setView([this.latitude, this.longitude], 15);
            L.marker([this.latitude, this.longitude]).addTo(this.map);

            resolve({ latitude: this.latitude, longitude: this.longitude });
          },
          (err) => reject(err)
        );
      } else {
        reject(new Error('Geolocation not supported'));
      }
    });
  }


  async saveLocation() {
    try {
      if (this.latitude === null || this.longitude === null) {
        alert('Location not available yet');
        return;
      }

      const userId = Number(localStorage.getItem('userId'));
      if (!userId || isNaN(userId)) {
        alert('Missing or invalid user ID');
        return;
      }

      const locationData = {
        userid: userId,
        latitude: this.latitude,
        longitude: this.longitude,
        time: new Date()
      };

      this.http.post(`${this.apiUrl}/location`, locationData).subscribe({
        next: () => {
          alert('Location saved!');
          this.router.navigate(['/list']).then();
        },
        error: (err) => alert('Error saving location: ' + err.error?.message || err.message)
      });
    } catch (err) {
      alert('Could not get location: ' + err);
    }
  }

  isLoggedIn() {
    return this.userService.isLoggedIn();
  }

  goToList() {
    this.router.navigate(['/list']).then();
  }
}
