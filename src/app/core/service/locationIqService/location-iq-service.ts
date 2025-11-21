import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment.js';

export interface LatLon {
  lat: string;
  lon: string; 
}

export interface LocationIQResponse {
  lat: string;
  lon: string; 
  display_name: string;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  
  private readonly API_KEY = environment.locationIqApiKey; 
  
  private readonly BASE_URL = 'https://us1.locationiq.com/v1/search';

  constructor(private http: HttpClient) { }

 
  geocodeAddress(rua: string, numero: string, bairro: string, cidade: string): Observable<LatLon | null> {
    
    const query = `${rua} ${numero}, ${bairro}, ${cidade}, Brasil`;
    
    const url = `${this.BASE_URL}?key=${this.API_KEY}&q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=br`;

    return this.http.get<LocationIQResponse[]>(url).pipe(
      map(response => {
        if (response && response.length > 0) {
          const result = response[0];
          return {
            lat: result.lat,
            lon: result.lon
          } as LatLon;
        }
        return null;
      })
    );
  }
}