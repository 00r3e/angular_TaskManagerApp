import { inject, Injectable } from '@angular/core';
import { Task} from '../task-manager/task-manager';
import { TasksService } from './tasks-service';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
   getCompletedTasksCount(tasks: Task[]): number {
    return tasks.filter(task => task.status === 'completed').length;
  }

  getPendingTasksCount(tasks: Task[]): number {
    return tasks.filter(task => task.status === 'pending').length;
  }

  getOverdueTasksCount(tasks: Task[]): number {

    const today = new Date();
    today.setHours(0,0,0,0);

    return tasks.filter(task =>
      new Date(task.dueDate) < today && task.status !== 'completed'
    ).length;
  }

  getCompletionRate(tasks: Task[]): number {

    if (tasks.length === 0) return 0;

    const completed = tasks.filter(t => t.status === 'completed').length;

    return Math.round((completed / tasks.length) * 100);
  }

  getProductivityLevel(tasks: Task[]): string {

    const rate = this.getCompletionRate(tasks);

    if (rate >= 80) return 'excellent';
    if (rate >= 60) return 'good';
    if (rate >= 40) return 'needs-improvement';
    return 'poor';
  }
}

