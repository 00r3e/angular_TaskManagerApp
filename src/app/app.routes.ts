import { Routes } from '@angular/router';
import { TaskManager } from './task-manager/task-manager';
import { Register } from './register/register';
import { Login } from './login/login';


export const routes: Routes = [
    {path:'dashboard', component: TaskManager},
    {path:'',redirectTo:'/dashboard' , pathMatch:'full'},
    // {path:'**', redirectTo:'/dashboard'},
    {path:'register', component: Register},
    {path:'login', component: Login}

];
