import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosComponent } from './usuarios.component';
import { UsuariosListComponent } from './usuarios-list/usuarios-list.component';
import { UsuariosCreateComponent } from './usuarios-create/usuarios-create.component';
import { UsuariosEditComponent } from './usuarios-edit/usuarios-edit.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { UsuariosRoutes } from './usuarios.routing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(UsuariosRoutes),
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    MatTooltipModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  declarations: [
    UsuariosComponent,
    UsuariosListComponent,
    UsuariosCreateComponent,
    UsuariosEditComponent
  ]
})
export class UsuariosModule { }
