import { Component, inject } from '@angular/core';
import { RegisterUser } from '../models/register-user';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../services/account';
import { Router } from '@angular/router';

@Component({
  standalone: true, 
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})

export class Register {
  constructor(private router: Router) {}
  registerUser: RegisterUser = new RegisterUser();
  accountService = inject(AccountService);


  onRegister(form: any) {
    if (form.valid) {
      console.log(this.registerUser);
      
      this.accountService.postRegister(this.registerUser).subscribe({
        next:(createdUser:any)=>{
          console.log(createdUser.email);
          this.accountService.currentUserName = createdUser.email;

          localStorage["token"] = createdUser.token;
          localStorage["refreshToken"] = createdUser.refreshToken;

          this.router.navigate(['/dashboard']);
        }
      });
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

}
