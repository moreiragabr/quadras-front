import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, delay, map, Observable, of } from 'rxjs';
import { User } from '../../models/user';
import { Quadra } from '../../models/quadra';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  API = 'http://localhost:8080/api/usuario/';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.API + 'findAll');
  }

  findUserById(id: number): Observable<User | null> {
    const url = `${this.API}findById/${id}`;

    // Força a resposta a ser lida como texto para prevenir o erro de parsing
    return this.http.get(url, { responseType: 'text' }).pipe(
      map((text) => {
        try {
          const data = JSON.parse(text);
          return data as User;
        } catch (e) {
          console.error('Erro ao fazer parse do JSON recebido do backend:', e);
          return null;
        }
      }),
      // Adiciona um pequeno delay para simular a latência da rede
      delay(300),
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao buscar usuário no serviço:', error);
        return of(null);
      })
    );
  }

  save(user: any): Observable<User> {
    return this.http.post<User>(this.API + 'save', user);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.API + 'delete/' + id);
  }

  update(id: number, user: any): Observable<User> {
    return this.http.put<User>(this.API + 'update/' + id, user);
  }

  adicionarTimeProprietario(idUser: number, idTeam: number): Observable<User> {
    return this.http.put<User>(
      this.API + 'adicionarTimeProprietario?idUsuario=' + idUser + '&idTime=' + idTeam,
      null
    );
  }

  adicionarTimeJogador(idUser: number, idTeam: number): Observable<User> {
    return this.http.put<User>(
      this.API + 'adicionarTimeJogador?idUsuario=' + idUser + '&idTime=' + idTeam,
      null
    );
  }

  removerTimeProprietario(idUser: number, idTeam: number): Observable<User> {
    return this.http.delete<User>(
      this.API + 'removerTimesProprietarios?idUsuario=' + idUser + '&idTime=' + idTeam
    );
  }

  removerTimeJogador(idUser: number, idTeam: number): Observable<User> {
    return this.http.delete<User>(
      this.API + 'removerTimesJogador?idUsuario=' + idUser + '&idTime=' + idTeam
    );
  }

  adicionarQuadraProprietario(idUser: number, idQuadra: number): Observable<User> {
    return this.http.put<User>(
      this.API + 'adicionarQuadraProprietario?idUsuario=' + idUser + '&idQuadra=' + idQuadra,
      null
    );
  }
}
