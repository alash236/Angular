import { Service } from './../@service/service';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {  Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  constructor(private router:Router,private service:Service){}
  userName:string="";
  userPassword:string="";

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
}
