import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Auth0Client } from '@auth0/auth0-spa-js';
import { DOCUMENT } from '@angular/common';
import { MapComponent } from '../map/map.component';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { ProfileFormComponent } from '../profile-form/profile-form.component';
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
  profile: any;
  name : any;
  username : any;
  user : any;
  bloodType : any;
  email : any;
  phone : any;
  address : any;
  formOpen: any;
  userLocation: any;
  
  constructor(@Inject(DOCUMENT) public document: Document, public auth: AuthService) {}
  ngOnInit(): void {
        this.formOpen = false;
        this.auth.getUser().subscribe(
          async (profile) => { 
            this.user = profile;
            const docRef = doc(db, "users", this.user.email); 
            const docSnap = await getDoc(docRef);
            
             if(docSnap.exists()) {
                this.email = docSnap.data().email,
                this.name = docSnap.data().name,
                this.address = docSnap.data().address,
                this.phone = docSnap.data().phone,
                this.bloodType = docSnap.data().bloodType
            } else {
              await setDoc(doc(db,"users", this.user.email), {
                email: this.user.email,
                name: this.user.name,
                username: "blank",
                bloodType: "blank",
                phone : "blank",
                address : "blank"
              });
            }
          },
        );
  }

  openProfileForm(): void {
    this.formOpen = true;
  }

  updateForm(val : boolean): void {
    this.formOpen = !this.formOpen;
  }
  
  updateLocation(location: string): void {
    this.userLocation = location
  }
}



