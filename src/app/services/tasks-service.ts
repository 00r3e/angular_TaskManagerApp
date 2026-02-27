import { Injectable } from '@angular/core';
import { Task} from '../task-manager/task-manager';


@Injectable({
  providedIn: 'root',
})

export class TasksService {
  
  tasks: Task[] = [];

  getTasks(): Task[]
  {
    return this.tasks;
  }

  addTask(task: Task): void
  {
    this.tasks.push(task);
  }

  deleteTask(id: number): void
  {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index !== -1)
    {
      this.tasks.splice(index, 1);
    }
  }

  toggleTaskComplete(id: number): void
  {
    const task = this.tasks.find(t => t.id === id);
    if (task)
    {
      if (task.status === 'completed')
      {
        task.status = 'pending';
      }
      else
      {
        task.status = 'completed';
      }
    }
  }

}
