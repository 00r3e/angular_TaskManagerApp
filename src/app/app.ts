import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBar } from './nav-bar/nav-bar';
import { TaskManager } from './task-manager/task-manager';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBar, TaskManager],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Task Manager');
}
