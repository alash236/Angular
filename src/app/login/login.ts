import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {  Router } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-login',
  imports: [FormsModule,MatIconModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  constructor(private router:Router){}
  userName:string="";
  userPassword:string="";
  changetype=false;

  login_data(userName: string, userPassword: string) {
    const username = userName.trim();
    const password = userPassword.trim();

    if (username === 'user' && password === 'user') {
      localStorage.setItem('currentUser', username);
      alert("登入成功!歡迎你: " + username);
      this.router.navigate(['/back']);
    }else{
      this.userName='';
      this.userPassword='';
      alert("帳號密碼錯誤!");
    }
  }
  changeType(){
    this.changetype = !this.changetype;
  }
}
