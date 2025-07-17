import { Login } from './login/login';
import { Routes } from '@angular/router';
import { Front } from './front/front';
import { Back } from './back/back';
import { BackAdd } from './back/back-add/back-add';
import { Question } from './question/question';
import { Preview } from './preview/preview';
import { Statistics } from './statistics/statistics';
import { Feedback } from './feedback/feedback';
import { QuestionPreview } from './back/back-add/question-preview/question-preview';
import { Singlestatistics } from './singlestatistics/singlestatistics';


export const routes: Routes = [
  {path:'',redirectTo:'/front',pathMatch:'full'},
  {path:'login',component:Login},
  {path:'front',component:Front},
  {path:'back',component:Back},
  {path:'back/add',component:BackAdd},
  {path:'back/add/question_preview/:id',component:QuestionPreview},
  {path:'question/:id',component:Question},
  {path:'preview/:id',component:Preview},
  {path:'singlestatistics/:id',component:Singlestatistics},
  {path: 'statistics', component:Statistics},
  {path:'feedback',component:Feedback}
];
