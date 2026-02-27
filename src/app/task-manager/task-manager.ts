import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TasksService } from '../services/tasks-service';
import { FilterService } from '../services/filter-service';
import { StatisticsService } from '../services/statistics-service';


//----------TYPES-----------


export interface Task {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  dueDate: Date;
  status: string;
  createdAt: Date;
};

@Component({
  selector: 'app-task-manager',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './task-manager.html',
  styleUrl: './task-manager.css',
})
export class TaskManager {

 //Service
  private tasksService : TasksService = inject(TasksService);
  private filterService: FilterService = inject(FilterService);
  private statisticsService: StatisticsService = inject(StatisticsService);


  //Dropdown Options
  categories: string[] = ['work', 'personal', 'shopping', 'health', 'finance', 'education', 'other'];
  priorities: string[] = ['low', 'medium', 'high', 'urgent'];
  statuses: string[] = ['pending', 'in-progress', 'completed', 'cancelled'];

  //Form data
  newTask: {
    title: string,
    description: string,
    category: string,
    priority: string,
    dueDate: string | Date,
    status: string
  } = {
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    dueDate: '',
    status: 'pending'
  };

  
  //Getters and Setters for filters
  get filterStatus(): string
  {
    return this.filterService.getStatusFilter(); 
  }

  set filterStatus(value: string)
  {
    this.filterService.setStatusFilter(value);
  }

  get filterCategory(): string
  {
    return this.filterService.getCategoryFilter();
  }

  set filterCategory(value: string)
  {
    this.filterService.setCategoryFilter(value);
  }

  get filterPriority(): string
  {
    return this.filterService.getPriorityFilter();
  }

  set filterPriority(value: string)
  {
    this.filterService.setPriorityFilter(value);
  }

  get showCompleted(): boolean
  {
    return this.filterService.getShowCompleted();
  }

  set showCompleted(value: boolean)
  {
    this.filterService.setShowCompleted(value);
  }



  getTasks(): Task[]
  {
    return this.tasksService.getTasks();
  }

  getCompletedTasks(): number
  {
    return this.statisticsService.getCompletedTasksCount();
  }

  getPendingTasks(): number
  {
    return this.statisticsService.getPendingTasksCount();
  }

  getOverdueTasks(): number
  {
    return this.statisticsService.getOverdueTasksCount();
  }

  getCompletionRate(): number
  {
    return this.statisticsService.getCompletionRate();
  }

  getProductivityLevel(): string
  {
    return this.statisticsService.getProductivityLevel();
  }

  addTask(): void
  {
    if (!this.newTask.title || !this.newTask.category || !this.newTask.dueDate)
    {
      return;
    }

    const task: Task = {
      id: Date.now(),
      title: this.newTask.title,
      description: this.newTask.description,
      category: this.newTask.category,
      priority: this.newTask.priority,
      dueDate: new Date(this.newTask.dueDate),
      status: this.newTask.status,
      createdAt: new Date()
    };

    this.tasksService.addTask(task);
    this.clearForm();
  }

  clearForm(): void
  {
    this.newTask = {
      title: '',
      description: '',
      category: '',
      priority: 'medium',
      dueDate: '',
      status: 'pending'
    };
  }

  getFilteredTasks(): Task[]
  {
    let filtered = [...this.getTasks()];

    if (this.filterStatus !== 'all')
    {
      filtered = filtered.filter(task => task.status === this.filterStatus);
    }

    if (this.filterCategory !== 'all')
    {
      filtered = filtered.filter(task => task.category === this.filterCategory);
    }

    if (this.filterPriority !== 'all')
    {
      filtered = filtered.filter(task => task.priority === this.filterPriority);
    }

    if (!this.showCompleted)
    {
      filtered = filtered.filter(task => task.status !== 'completed');
    }

    return filtered;
  }

  toggleTaskComplete(id: number): void
  {
    this.tasksService.toggleTaskComplete(id);
  }

  isOverdue(task: Task): boolean
  {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(task.dueDate) < today && task.status != 'completed';
  }

  deleteTask(id: number): void
  {
    this.tasksService.deleteTask(id);
  }
}