import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Home } from './features/home/home';
import { authGuard } from './core/guards/auth-guard';
import { Structure } from './features/layout/structure/structure';
import { TimesList } from './features/times/times-list/times-list';
import { QuadrasList } from './features/quadras/quadras-list/quadras-list';

export const routes: Routes = [
    // canActivate: [authGuard]
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
                path: 'quadras',
                loadComponent: () => QuadrasList,
                data: { preload: true },
                canActivate: [authGuard]
            }
        ]
    },
    {
        path: '**',
        redirectTo: ''
    }
];
