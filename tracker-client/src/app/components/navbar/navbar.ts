import { Component } from '@angular/core';
import { UserService } from '../../services/userService/user-service';
import { Router } from '@angular/router';
import {User} from '../../models/user';
import {NgOptimizedImage} from '@angular/common'; // Import Router for programmatic navigation


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  imports: [
    NgOptimizedImage
  ],
  styleUrls: ['./navbar.css']
})
export class Navbar {
  username: string | null = null;

  constructor(private userService: UserService, private router: Router) {
    this.userService.user$.subscribe((user: User | undefined) => {
      this.username = user?.username ?? null;
    });
  }


  logout() {
    this.userService.logout();
  }

  isLoggedIn() {
    return this.userService.isLoggedIn();
  }

  goToTracker() {
      this.router.navigate(['/tracker']).then();
  }

  goToList() {
    this.router.navigate(['/list']).then();
  }
}
