import { Component } from '@angular/core';
import { UserService } from '../../services/userService/user-service';
import { User } from '../../models/user';
import {FormsModule} from '@angular/forms';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  imports: [
    FormsModule,
    MatInput,
    MatButton,
    MatFormField,
    MatLabel
  ],
  styleUrls: ['./profile.css']
})
export class ProfileComponent {
  loginUsername = '';
  private data: {} | undefined;
  loginFirstname = '';
  loginLastname = '';
  loginEmail = '';
  sex = '';
  address = '';
  postalCode = '';
  city = '';
  country = '';

  constructor(private userService: UserService) {}

  updateUser() {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

    const updatedUser = {
      id: storedUser.id,
      username: this.loginUsername,
      firstname: this.loginFirstname,
      lastname: this.loginLastname,
      email: this.loginEmail,
      sex: this.sex,
      address: this.address,
      postalCode: this.postalCode,
      city: this.city,
      country: this.country,
    };

    console.log('Updating user:', updatedUser);

    this.userService.update(updatedUser).subscribe(result => {
      alert('User updated successfully.');
      localStorage.setItem('user', JSON.stringify(updatedUser));
      location.reload();
    });
  }

  isLoggedIn() {
    return this.userService.isLoggedIn();
  }
  ngOnInit() {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

    console.log('Stored user object:', storedUser);
    console.log('postalCode from storage:', storedUser.postalCode);

    if (storedUser) {
      this.loginUsername = storedUser.username || '';
      this.loginFirstname = storedUser.firstname || '';
      this.loginLastname = storedUser.lastname || '';
      this.loginEmail = storedUser.email || '';
      this.sex = storedUser.sex || '';
      this.address = storedUser.address || '';
      this.postalCode = storedUser.postalCode || '';
      this.city = storedUser.city || '';
      this.country = storedUser.country || '';

      console.log('this.postalCode after assignment:', this.postalCode);
    }
  }

}
