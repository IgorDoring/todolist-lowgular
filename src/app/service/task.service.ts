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
            priority: task.priority,
            url: task.url,
            createdAt: task.created_at,
          })),
        ),
      ),
    { initialValue: [] },
  );

  todolist: Signal<TaskModel[]> = computed(() => {
    return this.listSignal()
      .sort((a: TaskModel, b: TaskModel) => {
        if (this.sortBy() === 'priority') {
          return b.priority - a.priority;
        } else if (this.sortBy() === 'date') {
          const aDate = new Date(a.createdAt);
          const bDate = new Date(b.createdAt);
          return bDate.getTime() - aDate.getTime();
        }
        return a.id.localeCompare(b.id);
      })
      .filter((task) => {
        if (this.filter().trim() !== '') {
          return task.content
            .toLocaleLowerCase()
            .includes(this.filter().toLocaleLowerCase());
        }
        return true;
      });
  });
  sortBy: Signal<string> = signal('');
  filter: Signal<string> = signal('');

  addTask(taskForm: string) {
    this.http
      .post<TaskResponse>(
        'https://api.todoist.com/rest/v2/tasks',
        taskForm,
        this.headers,
      )
      .pipe(
        map((task: TaskResponse) => ({
          id: task.id,
          content: task.content,
          isCompleted: task.is_completed,
          priority: task.priority,
          url: task.url,
          createdAt: task.created_at,
        })),
      )
      .subscribe({
        next: (newTask: TaskModel) => {
          this.todolist().push(newTask);
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
      .pipe(
        map((task: TaskResponse) => ({
          id: task.id,
          content: task.content,
          isCompleted: task.is_completed,
          priority: task.priority,
          url: task.url,
          createdAt: task.created_at,
        })),
      )
      .subscribe({
        next: (eTask: TaskModel) => {
          const eTaskIndex = this.todolist().findIndex(
            (task) => task.id == eTask.id,
          );
          this.todolist()[eTaskIndex] = eTask;
        },
      });
  }

  // TODO: implement reactivity
  completeTask(taskId: string) {
    this.http
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
      .subscribe({
        next: () => {
          const taskIndex = this.todolist().findIndex(
            (task) => task.id == taskId,
          );
          if (taskIndex > -1) {
            this.todolist().splice(taskIndex, 1);
          }
        },
      });
  }
}
