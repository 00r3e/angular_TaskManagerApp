import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';


//----------TYPES-----------

type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';
type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
type TaskCategory =
  | 'work'
  | 'personal'
  | 'shopping'
  | 'health'
  | 'finance'
  | 'education'
  | 'other';

type Task = {
  id: number;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  dueDate: Date;
  status: TaskStatus;
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


  //----VIEW REFERENCES-------

  @ViewChild('titleInput') titleInput!: ElementRef;
  @ViewChild('categoryInput') categorySelect!: ElementRef;
  @ViewChild('dueDateInput') dueDateInput!: ElementRef;


  //---------STATE-----------

  title = 'Task Manager';

  tasks: Task[] = [];
  filteredTasks: Task[] = [];

  showCompletedTasks = false;

  priority: 'All' | TaskPriority = 'All';
  status: 'All' | TaskStatus = 'All';
  category: 'All' | TaskCategory = 'All';

  completionRate = 0;
  productivityLevel = 'poor';

  newTask = {
    title: '',
    description: '',
    category: '' as TaskCategory | '',
    priority: 'medium' as TaskPriority,
    dueDate: '',
    status: '' as TaskStatus | '',
  };


  //--------LIFECYCLE-----------

  ngOnInit(): void {
    this.refreshStats();
  }


  //-------ACTIONS----------------

  addTask(form: NgForm): void {
    if (!this.isTaskValid()) return;

    const task: Task = {
      id: Date.now(),
      title: this.newTask.title.trim(),
      description: this.newTask.description.trim(),
      category: this.newTask.category as TaskCategory,
      priority: this.newTask.priority,
      dueDate: new Date(this.newTask.dueDate),
      status: this.newTask.status || 'pending',
      createdAt: new Date(),
    };

    this.tasks.push(task);
    this.clearForm();
    this.refreshStats();
  }

  deleteTask(id: number): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.refreshStats();
  }

  toggleTaskComplete(id: number): void {

    this.showCompletedTasks = true;
    
    const task = this.tasks.find(t => t.id === id);
    if (!task) return;

    task.status = task.status === 'completed' ? 'pending' : 'completed';
    this.refreshStats();
  }


  //-------FILTERING & STATS------------

  getFilteredTasks(): Task[] {
    return this.tasks.filter(task => {
      const statusMatch =
        this.status === 'All' || task.status === this.status;

      const categoryMatch =
        this.category === 'All' || task.category === this.category;

      const priorityMatch =
        this.priority === 'All' || task.priority === this.priority;

      const completedMatch =
        this.showCompletedTasks || task.status !== 'completed';

      return statusMatch && categoryMatch && priorityMatch && completedMatch;
    });
  }

  getCompletionRate(): number {
    if (!this.tasks.length) return 0;

    const completed = this.tasks.filter(t => t.status === 'completed').length;
    return Math.round((completed / this.tasks.length) * 100);
  }

  getProductivityLevel(): string {
    const rate = this.getCompletionRate();

    if (rate > 80) return 'excellent';
    if (rate >= 60) return 'good';
    if (rate >= 40) return 'needs-improvement';
    return 'poor';
  }
  getCompletedTasks():number{ 
    return this.tasks.filter(t => t.status==='completed').length; 
  } 
  
  getPendingTasks():number{ 
    return this.tasks.filter(t => t.status==='pending').length; 
  } 
  
  getOverdueTasks():number{ 
    return this.tasks.filter(t => this.isOverdue(t)).length; 
  }


  //--------HELPERS-----------

  isOverdue(task: Task): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);

    return due < today;
  }

  getTasksByStatus(status: TaskStatus): Task[] {
    return this.tasks.filter(t => t.status === status);
  }

  refreshStats(): void {
    this.filteredTasks = this.getFilteredTasks();
    this.completionRate = this.getCompletionRate();
    this.productivityLevel = this.getProductivityLevel();
  }

  clearForm(): void {
    this.newTask = {
      title: '',
      description: '',
      category: '',
      priority: 'medium',
      dueDate: '',
      status: '',
    };
  }

  isTaskValid(): boolean {
    return !!(
      this.newTask.title.trim() &&
      this.newTask.category &&
      this.newTask.priority &&
      this.newTask.dueDate
    );
  }


  //-----------UX HELPERS-------------

  focusCategory(): void {
    if (this.newTask.title.trim()) {
      this.categorySelect.nativeElement.focus();
    }
  }

  focusDueDate(): void {
    if (this.newTask.category) {
      this.dueDateInput.nativeElement.focus();
    }
  }

  onFilterChange(source: string): void {
    this.filteredTasks = this.getFilteredTasks();
  }
}