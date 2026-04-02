import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { AccountService } from '../services/account';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
})
export class NavBar {

  constructor(private router: Router){};
  accountService = inject(AccountService);

  onLogOutClicked() {
    this.accountService.getLogout().subscribe({
      next: (response: string) => {
        this.accountService.currentUserName = null;

        localStorage.removeItem('token');
        
        this.router.navigate([ '/login' ]);
      },

      error: (error) => {},

      complete: () => {}
    });
  }

}
