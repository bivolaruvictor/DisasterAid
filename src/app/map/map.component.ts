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
  constructor() { }

  async ngOnInit(): Promise<void> {
    let loader = new Loader({
      apiKey: data.APIKEY
    })

    let center =  {lat: 44.439663, lng: 26.096306}
    let mapElement = document.getElementById("map") as HTMLElement;

    const map = await loader.load().then(() => {
      return new google.maps.Map(mapElement, {
        center: {lat: 44.439663, lng: 26.096306}, 
        zoom: 10
      })
    })

    const marker = new google.maps.Marker({
      position: center,
      map,
      title: "Click to zoom",
    });
  
    map.addListener("click", (e: any) => {
      this.placeMarkerAndPanTo(e.latLng, map);
    });
  }

  placeMarkerAndPanTo(latLng: google.maps.LatLng, map: google.maps.Map) {
    new google.maps.Marker({
      position: latLng,
      map: map,
    });
    map.panTo(latLng);
  }
  
}
