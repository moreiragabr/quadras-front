import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Home } from './features/home/home';
import { authGuard } from './core/guards/auth-guard';
import { Structure } from './features/layout/structure/structure';
import { TimesList } from './features/times/times-list/times-list';
import { QuadrasList } from './features/quadras/quadras-list/quadras-list';
import { AdminDashboard } from './features/admin/admin-dashboard/admin-dashboard';
import { adminGuard } from './core/guards/admin-guard';
import { UsuariosListAdmin } from './features/admin/lists/usuarios-list-admin/usuarios-list-admin';
import { QuadrasListAdmin } from './features/admin/lists/quadras-list-admin/quadras-list-admin';
import { TimesListAdmin } from './features/admin/lists/times-list-admin/times-list-admin';
import { Mapa } from './features/mapa/mapa';

export const routes: Routes = [
    {
        path: 'login',
        component: Login
    },
    {
        path: '',
        component: Structure,
        children: [
            { path: '', component: Home },
            {
                path: 'times',
                loadComponent: () => TimesList,
                data: { preload: true },
                canActivate: [authGuard]
            },
            {
                path: 'mapa',
                loadComponent: () => Mapa,
                data: { preload: true }
            },
            {
                path: 'quadras',
                loadComponent: () => QuadrasList,
                data: { preload: true },
            },
            {
                path: 'admin-dashboard',
                loadComponent: () => AdminDashboard,
                data: { preload: true },
                canActivate: [adminGuard, authGuard]
            },
            {
                path: 'usuarios-admin-list',
                loadComponent: () => UsuariosListAdmin,
                data: { preload: true },
                canActivate: [adminGuard, authGuard]
            },
            {
                path: 'quadras-admin-list',
                loadComponent: () => QuadrasListAdmin,
                data: { preload: true },
                canActivate: [adminGuard, authGuard]
            },
            {
                path: 'times-admin-list',
                loadComponent: () => TimesListAdmin,
                data: { preload: true },
                canActivate: [adminGuard, authGuard]
            },
        ]
    },
    {
        path: '**',
        redirectTo: ''
    }
];
