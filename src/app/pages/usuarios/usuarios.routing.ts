import { Routes, RouterModule } from '@angular/router';
import { UsuariosCreateComponent } from './usuarios-create/usuarios-create.component';
import { UsuariosEditComponent } from './usuarios-edit/usuarios-edit.component';
import { UsuariosListComponent } from './usuarios-list/usuarios-list.component';

export const UsuariosRoutes : Routes = [
  { path: 'listar',     component: UsuariosListComponent },
  { path: 'cadastrar',  component: UsuariosCreateComponent },
  { path: 'editar/:id', component: UsuariosEditComponent }
];
