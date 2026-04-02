import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TasksService } from '../services/tasks-service';
import { FilterService } from '../services/filter-service';
import { StatisticsService } from '../services/statistics-service';
import { AccountService } from '../services/account';

//----------TYPES-----------

export interface Task {
  id?: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  dueDate: Date;
  status: string;
  createdAt: Date;
}

export interface TaskAddRequest {
  Title: string;
  Description: string;
  Category: string;
  Priority: string;
  DueDate: Date;
  Status: string;
  CreatedAt: Date;
}

@Component({
  selector: 'app-task-manager',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './task-manager.html',
  styleUrl: './task-manager.css',
})
export class TaskManager implements OnInit{
  //Service
  private tasksService: TasksService = inject(TasksService);
  private filterService: FilterService = inject(FilterService);
  private statisticsService: StatisticsService = inject(StatisticsService);

  //Dropdown Options
  categories: string[] = [
    'work',
    'personal',
    'shopping',
    'health',
    'finance',
    'education',
    'other',
  ];
  priorities: string[] = ['low', 'medium', 'high', 'urgent'];
  statuses: string[] = ['pending', 'in-progress', 'completed', 'cancelled'];

  //Form data
  newTask: {
    title: string;
    description: string;
    category: string;
    priority: string;
    dueDate: string | Date;
    status: string;
  } = {
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    dueDate: '',
    status: 'pending',
  };

  tasks: Task[] = [];
  
  filteredTasks: Task[] = [];

  totalTasks = 0;
  completedTasks = 0;
  pendingTasks = 0;
  overdueTasks = 0;
  completionRate = 0;
  productivityLevel = '';

  //Injects
  private changeDetectorRef = inject(ChangeDetectorRef);
  private accountService = inject(AccountService);

  //Getters and Setters for filters
  get filterStatus(): string {
    return this.filterService.getStatusFilter();
  }

  set filterStatus(value: string) {
    this.filterService.setStatusFilter(value);
  }

  get filterCategory(): string {
    return this.filterService.getCategoryFilter();
  }

  set filterCategory(value: string) {
    this.filterService.setCategoryFilter(value);
  }

  get filterPriority(): string {
    return this.filterService.getPriorityFilter();
  }

  set filterPriority(value: string) {
    this.filterService.setPriorityFilter(value);
  }

  get showCompleted(): boolean {
    return this.filterService.getShowCompleted();
  }

  set showCompleted(value: boolean) {
    this.filterService.setShowCompleted(value);
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  getTasks(): Task[] {

    return this.tasks;
  }

  getCompletedTasks(): number {
    return this.statisticsService.getCompletedTasksCount(this.tasks);
  }

  getPendingTasks(): number {
    return this.statisticsService.getPendingTasksCount(this.tasks);
  }

  getOverdueTasks(): number {
    return this.statisticsService.getOverdueTasksCount(this.tasks);
  }

  getCompletionRate(): number {
    return this.statisticsService.getCompletionRate(this.tasks);
  }

  getProductivityLevel(): string {
    return this.statisticsService.getProductivityLevel(this.tasks);
  }

  addTask(): void {
    if (!this.newTask.title || !this.newTask.category || !this.newTask.dueDate) {
      return;
    }

    const task: TaskAddRequest = {
      Title: this.newTask.title,
      Description: this.newTask.description,
      Category: this.newTask.category,
      Priority: this.newTask.priority,
      DueDate: new Date(this.newTask.dueDate),
      Status: this.newTask.status,
      CreatedAt: new Date(),
    };

    this.tasksService.addTask(task).subscribe({
      next: (createdTask) => {
        console.log(createdTask.id); 
        this.loadTasks();
        this.clearForm();
      },
    });
    this.clearForm();
  }

  clearForm(): void {
    this.newTask = {
      title: '',
      description: '',
      category: '',
      priority: 'medium',
      dueDate: '',
      status: 'pending',
    };
  }

  getFilteredTasks(): void{
    let filtered = [...this.tasks];

    if (this.filterStatus !== 'all') {
      filtered = filtered.filter((task) => task.status === this.filterStatus);
    }

    if (this.filterCategory !== 'all') {
      filtered = filtered.filter((task) => task.category === this.filterCategory);
    }

    if (this.filterPriority !== 'all') {
      filtered = filtered.filter((task) => task.priority === this.filterPriority);
    }

    if (!this.showCompleted) {
      filtered = filtered.filter((task) => task.status !== 'completed');
    }

    this.filteredTasks = filtered;
  }

  toggleTaskComplete(id: number): void {
    this.tasksService.toggleTaskComplete(id).subscribe(() => {
      this.loadTasks();
    });
  }

  isOverdue(task: Task): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(task.dueDate) < today && task.status != 'completed';
  }

  deleteTask(id: number): void {
    this.tasksService.deleteTask(id).subscribe(() => {
      this.loadTasks();
    });
  }

  loadTasks(): void {
    this.tasksService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.refreshView();
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        console.error("Error loading tasks", err);
      }
    });
  }

  refreshView(){
    this.getFilteredTasks();
    this.updateStatistics();
  }

  updateStatistics(): void {
    this.totalTasks = this.tasks.length;
    this.completedTasks = this.statisticsService.getCompletedTasksCount(this.tasks);
    this.pendingTasks = this.statisticsService.getPendingTasksCount(this.tasks);
    this.overdueTasks = this.statisticsService.getOverdueTasksCount(this.tasks);
    this.completionRate = this.statisticsService.getCompletionRate(this.tasks);
    this.productivityLevel = this.statisticsService.getProductivityLevel(this.tasks);
    this.getFilteredTasks();
  }

  refreshClicked(): void{
    this.accountService.postGenerateNewToken().subscribe({
      next: (response: any) => {
        localStorage["token"] = response.token;
        localStorage["refreshToken"] = response.refreshToken;
        this.refreshView();
      },
      error: (err) => {
        console.error(err);
      },
      complete: ()=>{}
    });
  }
}
