import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  public focus1: boolean = false;
  public focus2: boolean = false;
  public formLogin: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private ngxLoader: NgxUiLoaderService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.formLogin = this.formBuilder.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }

  login() {
    this.ngxLoader.start();

    this.authService.login(this.formLogin.value).subscribe((response) => {
      this.ngxLoader.stop();
      this.router.navigate(['dashboard']);
    }, (errorResponse: HttpErrorResponse) => {
      if (errorResponse.error == 'Nome de usuário ou senha inválidos!') {
        this.ngxLoader.stop();
        this.showWarning(errorResponse.error);
      } else {
        this.ngxLoader.stop();
        this.showWarning("Ocorreu um erro inesperado. Tente novamente mais tarde.");
      }
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
}
