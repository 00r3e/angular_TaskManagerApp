import { Injectable, inject } from '@angular/core';
import { Task, TaskAddRequest} from '../task-manager/task-manager';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';


@Injectable({
  providedIn: 'root',
})

export class TasksService {

  private http = inject(HttpClient);
  
  tasks: Task[] = [];

  getTasks(): Observable<Task[]>
  {
    
    let headers = new HttpHeaders();

    const token = 
    localStorage.getItem('token');

    if (token) {
      headers = headers.set("Authorization", `Bearer ${token}`);
      console.log(headers);
    }
    return this.http.get<Task[]>("/api/tasks", {headers} );
  }

  addTask(task: TaskAddRequest): Observable<Task>
  {
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", `Bearer ${localStorage['token']}`);
    return this.http.post<Task>("/api/tasks", task, {headers: headers});
  }

  deleteTask(id: number): Observable<void> {
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", `Bearer ${localStorage['token']}`);
    return this.http.delete<void>(`/api/tasks/${id}`, {headers: headers });
  }

  toggleTaskComplete(id: number): Observable<void> {
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", `Bearer ${localStorage['token']}`);
    return this.http.patch<void>(`/api/tasks/${id}/toggle`, {headers: headers});
  }
}
