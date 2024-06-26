import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'app/models/usuario';
import { AuthService } from 'app/services/auth.service';
import { UsuarioService } from 'app/services/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  public usuario: Usuario;
  public formUsuario: FormGroup;
  public formAtualizarSenha: FormGroup;
  public image: Set<File>;
  public abrirAtualizaSenha: boolean = false;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private ngxLoader: NgxUiLoaderService,
    private usuarioService: UsuarioService,
    private toastr: ToastrService,
  ) {
  }

  ngOnInit() {
    this.buscaUsuarioLogado();
  }

  buscaUsuarioLogado() {
    this.ngxLoader.start();

    this.authService.getUsuarioAutenticado()
      .subscribe((resp: Usuario) => {
        this.usuario = resp;
        this.validaFormUsuario(this.usuario);
        this.ngxLoader.stop();
      });
  }

  validaFormUsuario(usuario: Usuario) {
    this.formUsuario = this.formBuilder.group({
      id: [usuario.id],
      userName: [usuario.userName, [Validators.required]],
      name: [usuario.name, [Validators.required]],
      email: [usuario.email, [Validators.required, Validators.email]],
      ativo: [usuario.ativo],
      image: [''],
    });

    this.formAtualizarSenha = this.formBuilder.group({
      password: [''],
      confirmPassword: ['']
    });
  }

  carregaImagem(event: any) {
    this.image = event.target.files;
  }

  editaUsuario() {
    this.ngxLoader.start();

    const id = this.usuario['id'];

    if (!this.image) {
      this.usuarioService.editar(id, this.formUsuario.value).subscribe((resp: Usuario) => {
        this.showSucesso('Perfil editado com sucesso!');
        this.buscaUsuarioLogado();
        this.ngxLoader.stop();        
      }, (err) => {
        this.showWarning('Erro ao editar perfil!');
        this.ngxLoader.stop();
      });
    } else {
      this.usuarioService.uploadFile(this.image).subscribe(resImg => {
        this.formUsuario.value.image = resImg['fileBase64'];

        this.usuarioService.editar(id, this.formUsuario.value).subscribe((resp: Usuario) => {
          this.showSucesso('Perfil editado com sucesso!');   
          this.buscaUsuarioLogado();
          this.ngxLoader.stop();  
        }, (err) => {
          this.showWarning('Erro ao editar perfil!');
          this.ngxLoader.stop();
        })
      });
    }
  }

  atualizaSenha() {
    this.ngxLoader.start();

    if (this.formAtualizarSenha.value.password !== this.formAtualizarSenha.value.confirmPassword) {
      this.showWarning('As senhas não conferem!');
      this.ngxLoader.stop();
      return false;
    }

    const id = this.usuario['id'];
    this.usuarioService.atualizarSenha(id, this.formAtualizarSenha.value).subscribe((resp: any) => {
      this.showSucesso(resp.message);
      this.ngxLoader.stop();
      this.abrirAtualizaSenha = false;
    }, (err) => {
      this.showWarning('Erro ao atualizar senha!');
      this.ngxLoader.stop();
    });
  }

  showAtualizaSenha(trueOrFalse) {
    this.abrirAtualizaSenha = trueOrFalse;
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
