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

  constructor() { }

  async ngOnInit(): Promise<void> {
  
    let loader = new Loader({
      apiKey: data.APIKEY,
      libraries: ['drawing', 'geometry', 'places', 'visualization']
    })

    let center = {lat: 44.439663, lng: 26.096306}

    let mapElement = document.getElementById("map") as HTMLElement;

    const map = await loader.load().then(() => {
      return new google.maps.Map(mapElement, {
        center: center, 
        zoom: 10
      })
    })

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
        position: center,
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
        center: center,
        radius: 100,
      },
    });

    drawingManager.setMap(map);
  
    map.addListener("click", (e: any) => {
      this.placeMarker(e.latLng, map);
    });


    new google.maps.Circle({
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      map,
      center: center,
      radius: 100,
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

    marker.addListener("click", () => {
      infowindow.open({
        anchor: marker,
        map,
        shouldFocus: false,
      });
    });
  }
  
}
