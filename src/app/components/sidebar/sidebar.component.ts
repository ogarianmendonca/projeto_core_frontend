import { Component, OnInit } from '@angular/core';
import { Usuario } from 'app/models/usuario';
import { AuthService } from 'app/services/auth.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'dashboard', class: '' },
  { path: '/user-profile', title: 'Perfil', icon: 'person', class: '' },
  { path: '/usuarios/listar', title: 'Usuários', icon: 'supervisor_account', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  public usuario: Usuario;

  constructor(
    private authService: AuthService,
    private ngxLoader: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);

    this.atualizaUsuarioLogado();
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };

  atualizaUsuarioLogado() {
    this.authService.atualizarPerfil
      .subscribe((resp: Usuario) => {
        this.usuario = resp;

        if (!this.authService.getToken()) {
          this.authService.logout();
        }
      });
  }

  logout(e) {
    this.ngxLoader.start();
    e.preventDefault();

    this.authService.logout();
    this.ngxLoader.stop();
  }
}
