import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  API = "http://localhost:8080/api/usuario/";

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.API + "findAll");
  }

  getUserById(id: number): Observable<User>{
    return this.http.get<User>(this.API + "findById/" + id);
  }

  save(user:any): Observable<User>{
    return this.http.post<User>(this.API+"save", user);
  }

  delete(id:number): Observable<void>{
    return this.http.delete<void>(this.API + "delete/" + id);
  }

  update(id:number, user:any): Observable<User>{
    return this.http.put<User>(this.API + "update/" + id, user);
  }

  adicionarTimeProprietario(idUser:number, idTeam:number): Observable<User>{
    return this.http.put<User>(this.API + "adicionarTimeProprietario?idUsuario=" + idUser + "&idTime=" + idTeam, null);
  }

  adicionarTimeJogador(idUser:number, idTeam:number): Observable<User>{
    return this.http.put<User>(this.API + "adicionarTimeJogador?idUsuario=" + idUser + "&idTime=" + idTeam, null);
  }

  removerTimeProprietario(idUser:number, idTeam:number): Observable<User>{
    return this.http.delete<User>(this.API + "removerTimesProprietarios?idUsuario=" + idUser + "&idTime=" + idTeam);
  }

  removerTimeJogador(idUser:number, idTeam:number): Observable<User>{
    return this.http.delete<User>(this.API + "removerTimesJogador?idUsuario=" + idUser + "&idTime=" + idTeam);
  }

  adicionarQuadraProprietario(idUser:number, idQuadra:number): Observable<User>{
    return this.http.put<User>(this.API + "adicionarQuadraProprietario?idUsuario=" + idUser + "&idQuadra=" + idQuadra, null);
  }

}
