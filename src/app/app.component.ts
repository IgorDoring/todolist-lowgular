import { AsyncPipe, CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { Task, TaskResponse } from './model/task';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, CommonModule, HttpClientModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  todolist$!: Observable<TaskResponse[]>;
  readonly projectId = '2335869742';
  private http: HttpClient = inject(HttpClient)
  newTask = '';
  taskForm = {project_id: this.projectId, content: ''}

  ngOnInit(): void {
    this.getTasks()
  }

  addTask(taskForm: NgForm){
    if(taskForm.valid){
      this.http.post("https://api.todoist.com/rest/v2/tasks", JSON.stringify(this.taskForm), {
      headers: {
        "Authorization":"Bearer 4073e1ba35bd897d02b44a5ac75b019d0688be37",
        "Content-Type": "application/json",
        "X-Request-Id": "2335869742"
      }
    }).subscribe({next: () => {
      this.getTasks()
    }})
  }
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
