import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Role } from 'app/models/role';
import { Usuario } from 'app/models/usuario';
import { AuthService } from 'app/services/auth.service';
import { RoleService } from 'app/services/role.service';
import { UsuarioService } from 'app/services/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-usuarios-edit',
  templateUrl: './usuarios-edit.component.html',
  styleUrls: ['./usuarios-edit.component.scss']
})
export class UsuariosEditComponent implements OnInit {
  public usuario: Usuario;
  public formUsuario: FormGroup;
  public formAtualizarSenha: FormGroup;
  public image: Set<File>;
  public abrirAtualizaSenha: boolean = false;
  public usuarioLogadoIsAdmin: boolean = false;

  public roles: Role[];
  public rolesSelecionado: FormArray;
  public formRoles: FormGroup;
  
  constructor(
    private routerActivated: ActivatedRoute,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private ngxLoader: NgxUiLoaderService,
    private usuarioService: UsuarioService,
    private toastr: ToastrService,
    private roleService: RoleService,
  ) {
  }

  ngOnInit() {
    this.buscaUsuarioLogado();
    this.buscaUsuarioSelecionado();
    this.buscarRoles();
  }

  buscaUsuarioLogado() {
    var usuario = this.authService.getUsuarioStorage();
    for (var i = 0; i < usuario.roles.length; i++) {
      if (usuario.roles[i].name == "ADMINISTRADOR") {
        this.usuarioLogadoIsAdmin = true;
      }
    }
  }

  buscaUsuarioSelecionado() {
    const id = this.routerActivated.snapshot.params['id'];
    this.ngxLoader.start();

    this.usuarioService.getUsuarioId(id).subscribe((resp: Usuario) => {
        this.usuario = resp;
        this.validaFormUsuario(this.usuario);
        this.ngxLoader.stop();
      });
  }

  buscarRoles() {
    this.ngxLoader.start();

    this.roleService.getRoles().subscribe((resp: Role[]) => {
      this.roles = resp;
      this.ngxLoader.stop();
    })
  }

  validaFormUsuario(usuario: Usuario) {
    this.formUsuario = this.formBuilder.group({
      id: [usuario.id],
      userName: [usuario.userName, [Validators.required]],
      name: [usuario.name, [Validators.required]],
      email: [usuario.email, [Validators.required, Validators.email]],
      ativo: [usuario.ativo],
      roles: [new Array()]
    });

    this.formAtualizarSenha = this.formBuilder.group({
      password: [''],
      confirmPassword: ['']
    });

    this.formRoles = this.formBuilder.group({
      roles: this.formBuilder.array([])
    });

    this.rolesSelecionado = this.formRoles.get('roles') as FormArray;

    this.usuario.roles.forEach(element => {
      this.rolesSelecionado.push(new FormControl(element.name));
    });
  }

  onCheckboxChange(e) {    
    if (e.target.checked) {
      this.rolesSelecionado.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      this.rolesSelecionado.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          this.rolesSelecionado.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  carregaImagem(event: any) {
    this.image = event.target.files;
  }

  editaUsuario() {
    this.ngxLoader.start();

    const id = this.usuario['id'];

    for (var i = 0; i < this.rolesSelecionado.value.length; i++) {
      this.formUsuario.value.roles.push({'name': this.rolesSelecionado.value[i]});
    }

    if (!this.image) {
      this.usuarioService.editar(id, this.formUsuario.value).subscribe((resp: Usuario) => {
        this.showSucesso('Perfil editado com sucesso!');
        this.buscaUsuarioSelecionado();
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
          this.buscaUsuarioSelecionado();
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
