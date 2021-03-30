import { Routes } from '@angular/router';
import { DashboardComponent } from 'app/pages/dashboard/dashboard.component';
import { IconsComponent } from 'app/pages/icons/icons.component';
import { NotificationsComponent } from 'app/pages/notifications/notifications.component';
import { TableListComponent } from 'app/pages/table-list/table-list.component';
import { TypographyComponent } from 'app/pages/typography/typography.component';
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
    { path: 'table-list',     component: TableListComponent },
    { path: 'typography',     component: TypographyComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'notifications',  component: NotificationsComponent },
];
