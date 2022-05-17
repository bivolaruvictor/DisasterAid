import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import {AppAuthButtonComponent} from '../app/app-auth-button/app-auth-button.component'
import { AppRoutingModule } from './app-routing.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'DisasterAid';
  constructor(public auth: AuthService) {}
}
