import { Component, OnInit } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import data from '../../../auth_config.json';
import { collection, addDoc, getDocs, GeoPoint, setDoc, doc, getDoc } from "firebase/firestore"; 
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { AuthService } from '@auth0/auth0-angular';

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
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {
  title = 'map'
  
  icons: Record<string, { icon: string }> = {
    blood: {
      icon: '../../assets/images/blood.png',
    }};

  directionsRenderer: any
  directionsService: any
  center: any;
  myLocationMarker:any;

  currentUser : any;

  bloodNeededInfoWindow:any;

  fireInfoWindow:any;

  constructor(public auth: AuthService) { }

  async ngOnInit(): Promise<void> {

  //   let position = new GeoPoint(44.439663, 26.096306)
  //   try {
  //     const docRef = await addDoc(collection(db, "BloodLocations"), {
  //       Name: "Ada",
  //       Position: position,
  //       Age: 123
  //     });
  //     console.log("Document written with ID: ", docRef.id);
  //   } catch (e) {
  //     console.error("Error adding document: ", e);
  //   }
    
  //   const querySnapshot = await getDocs(collection(db, "BloodLocations"));
  //     querySnapshot.forEach((doc: any) => {
  //     console.log(`${doc.id} => ${doc.data()}`); 
  // });


    let loader = new Loader({
      apiKey: data.APIKEY,
      libraries: ['drawing', 'geometry', 'places', 'visualization']
    })

    this.center = {lat: 44.439663, lng: 26.096306}

    let mapElement = document.getElementById("map") as HTMLElement;

    

    
    const map = await loader.load().then(() => {
      return new google.maps.Map(mapElement, {
        center: this.center, 
        zoom: 16
      })
    })

    navigator.geolocation.getCurrentPosition((position) => {  
      this.myLocationMarker = new google.maps.LatLng(position.coords.latitude, 
                                            position.coords.longitude);
  


        let newPoint = new google.maps.Marker({
        position: this.myLocationMarker,
        map: map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillOpacity: 1,
          strokeWeight: 2,
          fillColor: '#5384ED',
          strokeColor: '#ffffff',
        }});
      // Center the map on the new position
      map.setCenter(this.myLocationMarker);
    }); 

    this.bloodNeededInfoWindow = new google.maps.InfoWindow({
      content: 'Blood Donnor Needed',
    });
  
    this.fireInfoWindow = new google.maps.InfoWindow({
      content: 'Caution Fire',
    });

    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.directionsService = new google.maps.DirectionsService();

    const drawingManager = new google.maps.drawing.DrawingManager({
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.MARKER,
          google.maps.drawing.OverlayType.CIRCLE
        ],
      },
      markerOptions: {
        position: this.center,
        map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        icon: this.icons['blood'].icon,
        clickable: true,
      },
      circleOptions: {
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        map,
        center: this.center,
        radius: 100,
        clickable: true,
      },
    });

    drawingManager.setMap(map);
    this.directionsRenderer.setMap(map);


    google.maps.event.addListener(drawingManager, 'markercomplete',  async (marker: any) => {
      this.auth.getUser().subscribe(
        async (profile) => { 
          this.currentUser = profile;
          
          const userRef = doc(db, "users", this.currentUser.email);
          const userDetails = await getDoc(userRef);
          
          let userData = userDetails.data();

          //save blood points
          await addDoc(collection(db, "BloodLocations"), {
            location: [marker.getPosition().lat() , marker.getPosition().lng()],
            bloodType: userData?.bloodType
          });
            
          },
      );   
      google.maps.event.addListener(marker, 'click', (e:any) => {
        this.bloodNeededInfoWindow.open({
          anchor: marker,
          map,
          shouldFocus: false,
        });
        this.calculateAndDisplayRoute(e.latLng, this.myLocationMarker, this.directionsService, this.directionsRenderer);
      });
    });


    google.maps.event.addListener(drawingManager, 'circlecomplete',  (circle: any) => {
      google.maps.event.addListener(circle, 'click', (e:any) => {
        this.fireInfoWindow.setPosition(circle.getCenter());
        this.fireInfoWindow.open({
          anchor: circle,
          map,
          shouldFocus: false,
        });
        this.calculateAndDisplayRoute(circle.getCenter(), this.myLocationMarker, this.directionsService, this.directionsRenderer);
      });});


  }
  

  calculateAndDisplayRoute(
    destination: google.maps.LatLng,
    source: google.maps.LatLng, 
    directionsService: google.maps.DirectionsService,
    directionsRenderer: google.maps.DirectionsRenderer
  ) {
  
    directionsService
      .route({
        origin: source, // Haight.
        destination: destination, // Ocean Beach.
        // Note that Javascript allows us to access the constant
        // using square brackets and a string value as its
        // "property."
        travelMode: google.maps.TravelMode.WALKING,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
        console.log(response)
      })
      .catch((e) => window.alert("Directions request failed due to " + status));
  }
}

