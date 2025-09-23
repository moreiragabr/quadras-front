import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Home } from './features/home/home';
import { authGuard } from './core/guards/auth-guard';
import { Structure } from './features/layout/structure/structure';

export const routes: Routes = [
        // canActivate: [authGuard]
    {
        path: 'login',
        component: Login
    },
    {
        path: '',
        component: Structure,
        children:[
            {path: '', component: Home},
        ]
    },
    {
        path: '**',
        redirectTo: ''
    }
];
