import { inject, Injectable, Signal } from '@angular/core';
import { TaskResponse } from '../../model/task.model';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private router: Router = inject(Router);
  private http: HttpClient = inject(HttpClient);
  readonly projectId = '2335869742';
  readonly headers = {
    headers: {
      Authorization: 'Bearer 4073e1ba35bd897d02b44a5ac75b019d0688be37',
      'Content-Type': 'application/json',
      'X-Request-Id': '2335869742',
    },
  };
  listSignal: Signal<TaskResponse[]> = toSignal(
    this.http.get<TaskResponse[]>(
      'https://api.todoist.com/rest/v2/tasks',
      this.headers,
    ),
    { initialValue: [] },
  );

  loadTask(taskId: string) {
    const task = this.listSignal().find((task) => task.id === taskId);
    return task;
  }

  addTask(taskForm: string) {
    this.http
      .post<TaskResponse>(
        'https://api.todoist.com/rest/v2/tasks',
        taskForm,
        this.headers,
      )
      .subscribe({
        next: (newTask) => {
          this.listSignal().push(newTask);
        },
      });
  }

  //TODO: implement reactivity
  editTask(taskId: string, taskForm: string) {
    this.http
      .post<TaskResponse>(
        'https://api.todoist.com/rest/v2/tasks/' + taskId,
        taskForm,
        this.headers,
      )
      .subscribe({
        next: (eTask) => {
          const eTaskIndex = this.listSignal().findIndex(
            (task) => task.id == eTask.id,
          );
          this.listSignal()[eTaskIndex] = eTask;
          this.router.navigate(['/', 'details', taskId]);
        },
      });
  }

  // TODO: implement reactivity
  completeTask(taskIndex: number) {
    this.http
      .post(
        'https://api.todoist.com/rest/v2/tasks/' +
          this.listSignal()[taskIndex].id +
          '/close',
        null,
        {
          headers: {
            Authorization: 'Bearer 4073e1ba35bd897d02b44a5ac75b019d0688be37',
            'X-Request-Id': '2335869742',
          },
        },
      )
      .subscribe({
        next: () => {
          this.listSignal().splice(taskIndex, 1);
        },
      });
  }
}
