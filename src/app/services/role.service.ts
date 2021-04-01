import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Role } from 'app/models/role';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private urlApiRole = environment.api_url + 'role/';

  constructor(private http: HttpClient) { }

  getRoles (): Observable<Role[]> {
    return this.http.get<Role[]>(this.urlApiRole);
  }
}
