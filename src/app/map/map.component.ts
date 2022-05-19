import { Component, OnInit } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import data from '../../../auth_config.json';

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


  bloodNeededInfoWindow:any;

  fireInfoWindow:any;

  constructor() { }

  async ngOnInit(): Promise<void> {
  
    let loader = new Loader({
      apiKey: data.APIKEY,
      libraries: ['drawing', 'geometry', 'places', 'visualization']
    })

    this.center = {lat: 44.439663, lng: 26.096306}

    let mapElement = document.getElementById("map") as HTMLElement;

    

    
    const map = await loader.load().then(() => {
      return new google.maps.Map(mapElement, {
        center: this.center, 
        zoom: 10
      })
    })

    this.bloodNeededInfoWindow = new google.maps.InfoWindow({
      content: 'Blood Donnor Needed',
    });
  
    this.fireInfoWindow = new google.maps.InfoWindow({
      content: 'Caution Fire',
    });

    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.directionsService = new google.maps.DirectionsService();

    const drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.MARKER,
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

    map.addListener("click", (e: any) => {
      this.placeMarker(e.latLng, map);
      
    });


    google.maps.event.addListener(drawingManager, 'markercomplete',  (marker: any) => {
      google.maps.event.addListener(marker, 'click', (e:any) => {
        this.bloodNeededInfoWindow.open({
          anchor: marker,
          map,
          shouldFocus: false,
        });
        this.calculateAndDisplayRoute(e.latLng, this.center, this.directionsService, this.directionsRenderer);
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
        this.calculateAndDisplayRoute(circle.getCenter(), this.center, this.directionsService, this.directionsRenderer);
      });
    });
  }

  placeMarker(latLng: google.maps.LatLng, map: google.maps.Map) {

    

    let marker = new google.maps.Marker({
      position: latLng,
      map,
      draggable: true,
      animation: google.maps.Animation.DROP,
      icon: this.icons['blood'].icon,
    });

    marker.addListener("click", (e:any) => {
      this.bloodNeededInfoWindow.open({
        anchor: marker,
        map,
        shouldFocus: false,
      });
      let cent = new google.maps.LatLng(this.center)
      this.calculateAndDisplayRoute(e.latLng, cent , this.directionsService, this.directionsRenderer);
    });
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
