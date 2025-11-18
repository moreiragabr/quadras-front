import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Endereco } from '../../models/endereco';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CepService {

  constructor(private http: HttpClient) { }

  API = "viacep.com.br/ws/"

  findAdressByCep(cep:string): Observable<Endereco> {
    return this.http.get<Endereco>(this.API + cep + "/json/");
  }
}
