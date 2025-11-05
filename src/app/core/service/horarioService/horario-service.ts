import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {
  
  API = "http://localhost:8080/api/horarios/";

  constructor(private http: HttpClient) { }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.API + id);
  }
}
