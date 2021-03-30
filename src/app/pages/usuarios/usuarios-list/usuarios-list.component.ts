import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Role } from 'app/models/role';
import { Usuario } from 'app/models/usuario';
import { AuthService } from 'app/services/auth.service';
import { UsuarioService } from 'app/services/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-usuarios-list',
  templateUrl: './usuarios-list.component.html',
  styleUrls: ['./usuarios-list.component.scss']
})
export class UsuariosListComponent implements OnInit {

  public usuarios: Usuario[];
  public usuario: Usuario;
  public _filtroLista = '';
  public usuariosFiltrados: Usuario[];
  public usuarioLogado: Usuario;
  public acaoPermitida: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
    private ngxLoader: NgxUiLoaderService,
    private toastr: ToastrService,
    private authService: AuthService,
  ) { }

  get filtroLista(): string {
    return this._filtroLista;
  }

  set filtroLista(value: string) {
    this._filtroLista = value;
    this.usuariosFiltrados = this.filtroLista ? this.filtrarUsuario(this.filtroLista) : this.usuarios;
  }

  ngOnInit() {
    this.verificaUsuarioLogado();
    this.buscarUsuarios();
  }

  verificaUsuarioLogado() {
    this.usuarioLogado = this.authService.getUsuarioStorage();
    this.usuarioLogado.roles.forEach(element => {
      if (element.name === 'ADMINISTRADOR') {
        this.acaoPermitida = true;
      }
    });
  }

  filtrarUsuario(filtrarPor: string): Usuario[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.usuarios.filter(
      usuario => usuario.name.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  buscarUsuarios() {
    this.ngxLoader.start();
    
    this.usuarioService.getUsuarios().subscribe((resp) => {
      resp.sort(function (a, b) {	
        return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
      });
      
      this.usuarios = resp;
      this.usuariosFiltrados = resp;
      this.ngxLoader.stop();
    });
  }

  openModalExcluirUsuario(usuario: Usuario) {
    this.usuario = usuario;
  }

  excluirUsuario() {
    this.ngxLoader.start();

    this.usuarioService.excluir( this.usuario.id).subscribe((resp: any) => {
      this.showSucesso('Usuário excluído com sucesso!');
      this.buscarUsuarios();
      this.usuario = null;
    }, (error: any) => {
      this.showWarning('Erro ao excluir usuário!');
      this.ngxLoader.stop();
      this.usuario = null;
    });
  }

  showWarning(mensagem: string) {
    this.toastr.warning('<b>Ops!</b> ' + mensagem, '', {
      timeOut: 8000,
      closeButton: true,
      enableHtml: true,
      positionClass: 'toast-top-right'
    });
  }

  showSucesso(mensagem: string) {
    this.toastr.success(mensagem, '', {
      timeOut: 8000,
      closeButton: true,
      enableHtml: true,
      positionClass: 'toast-top-right'
    });
  }
}
