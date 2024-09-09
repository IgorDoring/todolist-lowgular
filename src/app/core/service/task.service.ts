import { inject, Injectable } from '@angular/core';
import { TaskResponse } from '../../model/task.model';
import { BehaviorSubject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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
  router = inject(Router);

  loadTasks() {
    this.http
      .get<TaskResponse[]>(
        'https://api.todoist.com/rest/v2/tasks',
        this.headers,
      )
      .pipe(tap((tasks: TaskResponse[]) => this.listSubject.next(tasks)))
      .subscribe();
  }

  loadTask(taskId: string) {
    return this.http.get<TaskResponse>(
      'https://api.todoist.com/rest/v2/tasks/' + taskId,
      this.headers,
    );
  }

  addTask(taskForm: string) {
    this.http
      .post<TaskResponse>(
        'https://api.todoist.com/rest/v2/tasks',
        taskForm,
        this.headers,
      )
      .pipe(
        tap((newTask) => {
          const currentTasks: TaskResponse[] = this.listSubject.getValue();
          this.listSubject.next([...currentTasks, newTask]);
          console.log(currentTasks);
        }),
      )
      .subscribe();
  }

  //TODO: use behavior subject
  editTask(taskId: number, taskForm: string) {
    this.http
      .post<TaskResponse>(
        'https://api.todoist.com/rest/v2/tasks/' + taskId,
        taskForm,
        this.headers,
      )
      .pipe(tap((editedTask) => console.log(editedTask)))
      .subscribe({
        next: (task) => {
          this.router.navigate(['/', 'details', task.id]);
        },
      });
  }

  // TODO: Use behavior subject
  completeTask(taskId: string) {
    return this.http
      .post(
        'https://api.todoist.com/rest/v2/tasks/' + taskId + '/close',
        null,
        {
          headers: {
            Authorization: 'Bearer 4073e1ba35bd897d02b44a5ac75b019d0688be37',
            'X-Request-Id': '2335869742',
          },
        },
      )
      .pipe(tap((res) => console.log(res)))
      .subscribe({
        next: () => this.loadTasks(),
      });
  }
}
