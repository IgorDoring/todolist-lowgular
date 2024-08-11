import { AsyncPipe, CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Task, TaskResponse } from './model/task';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, CommonModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'todolist-lowgular';
  todolist$!: Observable<TaskResponse[]>;

  private http: HttpClient = inject(HttpClient)

  ngOnInit(): void {
    this.getTasks()
  }

  getTasks() {
    this.todolist$ = this.http.get<TaskResponse[]>("https://api.todoist.com/rest/v2/tasks", {
      headers: {
        "Authorization":"Bearer 4073e1ba35bd897d02b44a5ac75b019d0688be37",
        "Content-Type": "application/json",
        "X-Request-Id": "2335869742"
      }
    })
  }
}
