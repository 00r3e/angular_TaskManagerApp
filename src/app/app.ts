import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBar } from './nav-bar/nav-bar';
import { AccountService } from './services/account';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Task Manager');

  private accountService = inject(AccountService);

  ngOnInit() {
      this.accountService.loadUserFromToken();
  }
}
