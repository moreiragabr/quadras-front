import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Quadra } from '../../models/quadra';
import { environment } from '../../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class QuadraService {

  private readonly API_KEY = environment.SERVIDOR; 

  API = `${this.API_KEY}/api/quadras`;

  constructor(private http: HttpClient) { }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.API + "/" + id);
  }

  findAll(): Observable<Quadra[]> {
    return this.http.get<Quadra[]>(this.API);
  }

  findById(id:number): Observable<Quadra>{
    return this.http.get<Quadra>(this.API + "/" + id);
  }

  findByCampoId(id:number): Observable<Quadra>{
    return this.http.get<Quadra>(this.API + "/campo/" + id)
  }

  save(quadra: any): Observable<Quadra> {
    return this.http.post<Quadra>(this.API, quadra);
  }

  update(id: number, quadra: any): Observable<Quadra> {
    return this.http.put<Quadra>(this.API + "/" + id, quadra);
  }

}
