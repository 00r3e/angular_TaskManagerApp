import { Component, inject } from '@angular/core';
import { LoginUser } from '../models/login-user';
import { AccountService } from '../services/account';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  constructor(private router: Router) {}

  loginUser: LoginUser = new LoginUser();
  accountService = inject(AccountService);

  onLogin(form: any) {
    if (form.valid) {
      console.log(this.loginUser);
      // call API here
      this.accountService.postLogin(this.loginUser).subscribe({
        next:(createdUser: any)=>{
          console.log(createdUser.email);
          this.accountService.currentUserName = createdUser.email;
          localStorage["token"]= createdUser.token;
          localStorage["refreshToken"]= createdUser.refreshToken;

          this.router.navigate(['/dashboard']);
        }
      });
    }
  }

  goToRegister(){
    this.router.navigate(['/register']);
  }

}
