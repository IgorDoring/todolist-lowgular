import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { TaskResponse } from '../../model/task';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private http: HttpClient = inject(HttpClient);
  readonly projectId = '2335869742';
  readonly headers = {
    headers: {
      'Authorization': 'Bearer 4073e1ba35bd897d02b44a5ac75b019d0688be37',
      'Content-Type': 'application/json',
      'X-Request-Id': '2335869742',
    },
  };
  taskForm = { project_id: this.projectId, content: '' };
  listSubject: BehaviorSubject<TaskResponse[]> = new BehaviorSubject<
    TaskResponse[]
  >([]);
  todolist$: Observable<TaskResponse[]> = this.listSubject.asObservable();

  ngOnInit(): void {
    this.loadTasks();
  }

  addTask(taskForm: NgForm) {
    if (taskForm.valid) {
      this.http
        .post<TaskResponse>(
          'https://api.todoist.com/rest/v2/tasks',
          JSON.stringify(this.taskForm),
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

  loadTasks() {
    this.http
      .get<TaskResponse[]>('https://api.todoist.com/rest/v2/tasks', this.headers)
      .pipe(tap((tasks) => this.listSubject.next(tasks)))
      .subscribe();
  }
}
