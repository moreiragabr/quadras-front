import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Time } from '../../models/time';
import { environment } from '../../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

    private readonly API_KEY = environment.SERVIDOR; 

  API = `${this.API_KEY}/api/time/`;

  constructor(private http: HttpClient) { }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.API + "delete/" + id);
  }

  getAll(): Observable<Time[]> {
    return this.http.get<Time[]>(this.API + "findAll");
  }

  update(id: number, time: any): Observable<Time> {
    return this.http.put<Time>(this.API + "update/" + id, time);
  }

  save(time: any): Observable<Time> {
    return this.http.post<Time>(this.API + "save", time);
  }
}

