import { inject, Injectable } from '@angular/core';
import { TaskResponse } from '../../model/task';
import { BehaviorSubject, tap } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http: HttpClient = inject(HttpClient);
  readonly projectId = '2335869742';
  readonly headers = {
    headers: {
      Authorization: 'Bearer 4073e1ba35bd897d02b44a5ac75b019d0688be37',
      'Content-Type': 'application/json',
      'X-Request-Id': '2335869742',
    },
  };
  listSubject: BehaviorSubject<TaskResponse[]> = new BehaviorSubject<
    TaskResponse[]
  >([]);

  constructor() {}

  loadTasks() {
    this.http
      .get<TaskResponse[]>(
        'https://api.todoist.com/rest/v2/tasks',
        this.headers
      )
      .pipe(tap((tasks: TaskResponse[]) => this.listSubject.next(tasks)))
      .subscribe();
  }

  addTask(taskForm: string) {
    this.http
      .post<TaskResponse>(
        'https://api.todoist.com/rest/v2/tasks',
        taskForm,
        this.headers
      )
      .pipe(
        tap((newTask) => {
          const currentTasks: TaskResponse[] = this.listSubject.getValue();
          this.listSubject.next([...currentTasks, newTask]);
        })
      )
      .subscribe();
  }
}
