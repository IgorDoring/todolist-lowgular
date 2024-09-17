import { computed, inject, Injectable, Signal } from '@angular/core';
import { TaskResponse } from '../../model/task.model';
import { BehaviorSubject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';

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
  listSignal: Signal<TaskResponse[]> = toSignal(
    this.http.get<TaskResponse[]>(
      'https://api.todoist.com/rest/v2/tasks',
      this.headers,
    ),
    { initialValue: [] },
  );

  loadTasks() {
    return this.listSignal();
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
      .subscribe({
        next: (newTask) => {
          this.listSignal().push(newTask);
        },
      });
  }

  //TODO: use behavior subject
  editTask(taskId: string, taskForm: string) {
    return this.http.post<TaskResponse>(
      'https://api.todoist.com/rest/v2/tasks/' + taskId,
      taskForm,
      this.headers,
    );
  }

  // TODO: Use behavior subject
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
