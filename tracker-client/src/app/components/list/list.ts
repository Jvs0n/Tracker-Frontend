import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { UserService } from '../../services/userService/user-service';

@Component({
  selector: 'app-list',
  templateUrl: './list.html',
  standalone: true,
  imports: [DatePipe],
  styleUrls: ['./list.css']
})
export class ListComponent implements OnInit {
  locations: any[] = [];
  apiUrl = 'http://localhost:3000/users';

  sortColumn: string = '';
  sortAscending: boolean = true;

  constructor(private http: HttpClient, private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.loadLocations();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.urlAfterRedirects === '/list') {
        this.loadLocations();
      }
    });
  }

  loadLocations() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('No user logged in');
      return;
    }

    this.http.get<any[]>(`${this.apiUrl}/locations/${userId}`).subscribe({
      next: (data) => {
        console.log('Locations fetched:', data);
        this.locations = data;
        this.sortLocations('time');
      },
      error: (err) => {
        console.error('Error loading locations:', err);
        alert('Failed to load locations: ' + (err.error?.message || err.message));
      }
    });
  }

  isLoggedIn() {
    return this.userService.isLoggedIn();
  }

  sortLocations(column: string) {
    if (this.sortColumn === column) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortColumn = column;
      this.sortAscending = true;
    }

    this.locations.sort((a, b) => {
      let valueA = a[column];
      let valueB = b[column];

      if (column === 'time') {
        valueA = new Date(a[column]);
        valueB = new Date(b[column]);
      }

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return this.sortAscending ? valueA - valueB : valueB - valueA;
      } else if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.sortAscending
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      return 0;
    });
  }
}
