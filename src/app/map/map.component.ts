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
      },
    });

    drawingManager.setMap(map);
    this.directionsRenderer.setMap(map);

    map.addListener("click", (e: any) => {
      this.placeMarker(e.latLng, map);
      
    });
  }

  placeMarker(latLng: google.maps.LatLng, map: google.maps.Map) {

    const infowindow = new google.maps.InfoWindow({
      content: 'Blood Donnor Needed',
    });

    let marker = new google.maps.Marker({
      position: latLng,
      map,
      draggable: true,
      animation: google.maps.Animation.DROP,
      icon: this.icons['blood'].icon,
    });

    marker.addListener("click", (e:any) => {
      infowindow.open({
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
