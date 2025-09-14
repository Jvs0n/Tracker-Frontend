import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from './services/userService/user-service';
import {Navbar} from './components/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = 'TrackidyTracker';
  constructor(private userService: UserService) {}

  isAdmin() {
    return this.userService.isAdmin();
  }


}
