import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';
import { MapComponent } from '../map/map.component';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import data from '../../../auth_config.json';

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
const db = getFirestore(app);

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html'
})
export class UserProfileComponent implements OnInit{
  profileJson: any;
  name : any;
  username : any;
  user : any;
  bloodType : any;
  email : any;
  phone : any;
  address : any;
  
  constructor(@Inject(DOCUMENT) public document: Document, public auth: AuthService) {}
    ngOnInit(): void {
      this.auth.isAuthenticated$.subscribe(
        (profile) => (this.profileJson = profile),
      );
      console.log(this.profileJson);
      // let user = this.auth.user$;
      // console.log(loginInfo);
      this.auth.user$.subscribe(
        (profile) => (this.user = profile),
      );
      // console.log(this.user.name); 
      // const docRef = doc(db, "users", ); 
      // const docSnap = await getDoc(docRef);
      
      // if(docSnap.exists()) {
  
      // } else {
        
      // }
    }
    
  
}



