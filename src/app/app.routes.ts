import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login';
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
import { QuadrasDetail } from './features/quadras/quadras-detail/quadras-detail';
import { QuadrasAdd } from './features/quadras/quadras-add/quadras-add';
import { QuadrasAdd2 } from './features/quadras/quadras-add/quadras-add-2/quadras-add-2';
import { notAutGuardGuard } from './core/guards/not-aut-guard-guard';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [notAutGuardGuard]
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
                path: 'quadras/:id',
                loadComponent: () => QuadrasDetail,
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
            {
                path: 'nova-quadra',
                loadComponent: () => QuadrasAdd,
                data: { preload: true },
                canActivate: [authGuard]
            },
            {
                path: 'nova-quadra-2',
                loadComponent: () => QuadrasAdd2,
                data: { preload: true },
                canActivate: [authGuard]
            },
        ]
    },
    {
        path: '**',
        redirectTo: ''
    }
];
