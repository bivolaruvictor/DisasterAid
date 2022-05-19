import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Auth0Client } from '@auth0/auth0-spa-js';
import { DOCUMENT } from '@angular/common';
import { MapComponent } from '../map/map.component';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
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
  
  constructor(@Inject(DOCUMENT) public document: Document, public auth: AuthService) {}
    ngOnInit(): void {
        this.auth.getUser().subscribe(
          async (profile) => { 
            this.user = profile;
            const docRef = doc(db, "users", this.user.email); 
            const docSnap = await getDoc(docRef);
            
             if(docSnap.exists()) {
              console.log("l am gasit")
            } else {
              await setDoc(doc(db,"users", this.user.email), {
                email: this.user.email,
                name: this.user.name,
                username: "blank",
                bloodType: "blank",
                phone : "blank",
                address : "blank"
              });
              console.log("mai incearca")
            }
          },
        );
    }
  
}



