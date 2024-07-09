import { AsyncPipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { Task } from './model/task';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'todolist-lowgular';

  todolist$: Observable<Task[]> | undefined;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.todolist$ = this.getTasks()
    this.http.get<Task[]>("https://api.todoist.com/rest/v2/tasks",{
      headers: {
        "Authorization":"Bearer 4073e1ba35bd897d02b44a5ac75b019d0688be37",
        "Content-Type": "application/json",
        "X-Request-Id": "2335869742"
      }
    }).subscribe(
      (res) => {
        console.log(res)
      }
    )
  }

  getTasks() {
    return this.http.get<Task[]>("https://api.todoist.com/rest/v2/tasks", {
      headers: {
        "Authorization":"Bearer 4073e1ba35bd897d02b44a5ac75b019d0688be37",
        "Content-Type": "application/json",
        "X-Request-Id": "2335869742"
      }
    })
  }
}
