import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';
import {AppAuthButtonComponent} from '../app/app-auth-button/app-auth-button.component'
import { AppRoutingModule } from './app-routing.module';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import data from '../../auth_config.json';
import { async } from '@firebase/util';

const firebaseConfig = {
  apiKey: data.apiKey,
  authDomain: data.authDomain,
  projectId: data.projectId,
  storageBucket: data.storageBucket,
  messagingSenderId: data.messagingSenderId,
  appId: data.appId,
  measurementId: data.measurementId
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'DisasterAid';
  constructor(@Inject(DOCUMENT) public document: Document, public auth: AuthService) {}
}
