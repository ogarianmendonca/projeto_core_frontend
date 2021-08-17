import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Role } from 'app/models/role';
import { Usuario } from 'app/models/usuario';
import { AuthService } from 'app/services/auth.service';
import { RoleService } from 'app/services/role.service';
import { UsuarioService } from 'app/services/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-usuarios-create',
  templateUrl: './usuarios-create.component.html',
  styleUrls: ['./usuarios-create.component.scss']
})
export class UsuariosCreateComponent implements OnInit {
  public usuario: Usuario;
  public formUsuario: FormGroup;
  public image: Set<File>;
  public usuarioLogadoIsAdmin: boolean = false;

  public roles: Role[];
  public rolesSelecionado: FormArray;
  
  constructor(
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
    this.buscarRoles();
    this.validaFormUsuario();
  }

  buscaUsuarioLogado() {
    var usuario = this.authService.getUsuarioStorage();
    for (var i = 0; i < usuario.roles.length; i++) {
      if (usuario.roles[i].name == "ADMINISTRADOR") {
        this.usuarioLogadoIsAdmin = true;
      }
    }
  }

  buscarRoles() {
    this.ngxLoader.start();

    this.roleService.getRoles().subscribe((resp: Role[]) => {
      this.roles = resp;
      this.ngxLoader.stop();
    })
  }

  validaFormUsuario() {
    this.formUsuario = this.formBuilder.group({
      userName: ['', [Validators.required]],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      roles: this.formBuilder.array([]),
    });
  }

  onCheckboxChange(e) {    
    this.rolesSelecionado = this.formUsuario.get('roles') as FormArray;

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

  cadastraUsuario() {
    this.ngxLoader.start();

    if (this.formUsuario.value.password !== this.formUsuario.value.confirmPassword) {
      this.showWarning('As senhas não conferem!');
      this.ngxLoader.stop();
      return false;
    }

    var roles = this.formUsuario.value.roles;
    this.formUsuario.value.roles = new Array();
    for (var i = 0; i < roles.length; i++) {
      this.formUsuario.value.roles.push({'name': roles[i]});
    }

    if (this.formUsuario.value.roles.length == 0) {
      this.showWarning('Obrigatório selecionar uma função para este usuário!');
      this.ngxLoader.stop();
      return;
    }

    if (!this.image) {
      this.usuarioService.cadastrar(this.formUsuario.value).subscribe((resp: Usuario) => {
        this.showSucesso('Usuário cadastrado com sucesso!');
        this.validaFormUsuario();
        this.rolesSelecionado.clear();
        this.ngxLoader.stop();        
      }, (err) => {
        this.showWarning('Erro ao cadastrar perfil!');
        this.ngxLoader.stop();
      });
    } else {
      this.usuarioService.uploadFile(this.image).subscribe(resImg => {
        this.formUsuario.value.image = resImg['fileBase64'];

        this.usuarioService.cadastrar(this.formUsuario.value).subscribe((resp: Usuario) => {
          this.showSucesso('Usuário cadastrado com sucesso!');   
          this.validaFormUsuario();
          this.rolesSelecionado.clear();
          this.ngxLoader.stop();  
        }, (err) => {
          this.showWarning('Erro ao cadastrar perfil!');
          this.ngxLoader.stop();
        })
      });
    }
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
