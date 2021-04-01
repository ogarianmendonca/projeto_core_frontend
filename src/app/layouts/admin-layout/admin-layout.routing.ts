import { Routes } from '@angular/router';
import { DashboardComponent } from 'app/pages/dashboard/dashboard.component';
import { UserProfileComponent } from 'app/pages/user-profile/user-profile.component';
import { UsuariosComponent } from 'app/pages/usuarios/usuarios.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    {
        path: 'usuarios',
        component: UsuariosComponent,
        loadChildren: '../../pages/usuarios/usuarios.module#UsuariosModule'
    },
];
