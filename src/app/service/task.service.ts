import { computed, inject, Injectable, signal, Signal } from '@angular/core';
import { TaskModel, TaskResponse } from '../model/task.model';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { map } from 'rxjs';

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
  listSignal: Signal<TaskModel[]> = toSignal(
    this.http
      .get<
        TaskResponse[]
      >('https://api.todoist.com/rest/v2/tasks', this.headers)
      .pipe(
        map((tasks: TaskResponse[]) =>
          tasks.map((task) => ({
            id: task.id,
            content: task.content,
            isCompleted: task.is_completed,
          })),
        ),
      ),
    { initialValue: [] },
  );
  filter: Signal<string> = signal('');

  filterTasks() {
    const filteredList: Signal<TaskModel[]> = computed(() => {
      return this.listSignal().filter((task) => {
        if (this.filter().trim() !== '') {
          return task.content.toLocaleLowerCase().includes(this.filter());
        }
        return true;
      });
    });
    return filteredList();
  }

  // TODO: add tosignal to get tasks
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
