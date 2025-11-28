import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {

  private readonly API_KEY = environment.SERVIDOR; 
  
  API = `${this.API_KEY}/api/horarios/`;

  constructor(private http: HttpClient) { }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.API + id);
  }
}
