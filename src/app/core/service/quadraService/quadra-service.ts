import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Quadra } from '../../models/quadra';

@Injectable({
  providedIn: 'root'
})
export class QuadraService {

  API = "http://localhost:8080/api/quadras";

  constructor(private http: HttpClient) { }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.API + "/" + id);
  }

  findAll(): Observable<Quadra[]>{
    return this.http.get<Quadra[]>(this.API);
  }

}
