import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

/**
 * Usar em requisições post e put
 */
 const httpOptions = {
  headers: new HttpHeaders(
    {'Content-Type': 'application/json'}
  )
};

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private urlApiUsuario = environment.api_url + 'usuario/';

  constructor(private http: HttpClient) { }

  // getUsuarios (pagina = 1): Observable<Usuario[]> {
  //   return this.http.get<Usuario[]>(this.urlApiUsuario + '?page=' + pagina);
  // }

  // cadastrarUsuario (dados): Observable<Usuario> {
  //   return this.http.post<Usuario>(this.urlApiUsuario, dados, httpOptions);
  // }

  // getUsuarioId(id) {
  //   return this.http.get<Usuario>(this.urlApiUsuario + id);
  // }

  editarUsuario (id, dados): Observable<Usuario> {
    return this.http.put<Usuario>(this.urlApiUsuario + id, dados, httpOptions);
  }

  // excluirUsuario(id) {
  //   return this.http.delete(this.urlApiUsuario + id);
  // }

  atualizarSenha (id, dados): Observable<any> {
    return this.http.put<any>(this.urlApiUsuario + 'atualizar-senha/' + id, dados, httpOptions);
  } 

  uploadFile(arquivo) {
    const formData = new FormData();
    formData.append('image', arquivo[0]);
    return this.http.post(this.urlApiUsuario + 'convert-file', formData);
  }
}
