import { Login } from './login/login';
import { Routes } from '@angular/router';
import { Front } from './front/front';
import { Back } from './back/back';
import { BackAdd } from './back/back-add/back-add';
import { Question } from './question/question';

export const routes: Routes = [
  {path:'',redirectTo:'/front',pathMatch:'full'},
  {path:'login',component:Login},
  {path:'front',component:Front},
  {path:'back',component:Back},
  {path:'back/add',component:BackAdd},
  {path:'question/:id',component:Question}
];
