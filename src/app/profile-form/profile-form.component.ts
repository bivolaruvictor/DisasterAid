import { Component, Inject, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Auth0Client } from '@auth0/auth0-spa-js';
import { DOCUMENT } from '@angular/common';
import { MapComponent } from '../map/map.component';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import data from '../../../auth_config.json';
import { Validators, FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';



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
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.css']
})
export class ProfileFormComponent implements OnInit {

  @Output() closeForm : EventEmitter<boolean> = new EventEmitter<boolean>();

  profile: any;
  name : any;
  username : any;
  user : any;
  bloodType : any;
  email : any;
  phone : any;
  address : any;
  userDetailsForm:any;

  BloodTypes: any = ['A', 'B', 'AB', '0']

  get bloodtypes() {
    return this.userDetailsForm.get('bloodtypes');
  }

  changeBloodType(e: any): void {
    this.bloodtypes.setValue(e.target.value, {
      onlySelf: true
    })
  }

  account_validation_messages = {
    'username': [
      { type: 'required', message: 'Username is required' },
      { type: 'minlength', message: 'Username must be at least 5 characters long' },
      { type: 'maxlength', message: 'Username cannot be more than 25 characters long' },
      { type: 'pattern', message: 'Your username must contain only numbers and letters' },
      { type: 'validUsername', message: 'Your username has already been taken' }
    ],
    'email': [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Enter a valid email' }
    ],
    'confirm_password': [
      { type: 'required', message: 'Confirm password is required' },
      { type: 'areEqual', message: 'Password mismatch' }
    ],
    'password': [
      { type: 'required', message: 'Password is required' },
      { type: 'minlength', message: 'Password must be at least 5 characters long' },
      { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number' }
    ],
    'terms': [
      { type: 'pattern', message: 'You must accept terms and conditions' }
    ]
    }

  constructor(@Inject(DOCUMENT) public document: Document, public auth: AuthService) {
    this.userDetailsForm = new FormGroup({
      bloodtypes: new FormControl('', Validators.required),
      fullname: new FormControl(''),
      email: new FormControl(''),
      phone: new FormControl(''),
      address: new FormControl(''),
      photoURL: new FormControl(''),
    });
  }

  @Input()
  userLocation!: string;
  

  ngOnInit(): void {
    this.userDetailsForm.patchValue({photoURL: "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"})
    this.auth.getUser().subscribe(
      async (profile) => { 
        this.user = profile;
        const docRef = doc(db, "users", this.user.email); 
        const docSnap = await getDoc(docRef);
        
         if(docSnap.exists()) {
          this.userDetailsForm.patchValue({
            email: docSnap.data().email,
            fullname: docSnap.data().name,
            address :  docSnap.data().address,
            phone : docSnap.data().phone,
            bloodType: docSnap.data().bloodType
          })
        }
      },
    );
  }

  async submit():Promise<void> {
    const docRef = doc(db, 'users', this.userDetailsForm.value.email);
    await updateDoc(docRef, {
      email: this.userDetailsForm.value.email,
      name: this.userDetailsForm.value.fullname,
      bloodType: this.userDetailsForm.value.bloodtypes,
      phone : this.userDetailsForm.value.phone,
      address : this.userDetailsForm.value.address
    });

    this.closeForm.emit(true);
  }

}
