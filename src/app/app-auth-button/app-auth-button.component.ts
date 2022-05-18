import { Component, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';
import { UserProfileComponent } from '../user-profile/user-profile.component';

@Component({
  selector: 'app-auth-button',
  templateUrl: './app-auth-button.component.html',
  styleUrls: ['./app-auth-button.component.css']
})
export class AppAuthButtonComponent {
  // Inject the authentication service into your component through the constructor
  constructor(@Inject(DOCUMENT) public document: Document, public auth: AuthService) {}
}
