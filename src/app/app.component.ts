import { AsyncPipe, CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
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
  private http: HttpClient = inject(HttpClient)
  readonly projectId = '2335869742';
  taskForm = {project_id: this.projectId, content: ''}
  listSubject: BehaviorSubject<TaskResponse[]> = new BehaviorSubject<TaskResponse[]>([])
  todolist$: Observable<TaskResponse[]> = this.listSubject.asObservable()
  
  ngOnInit(): void {
    this.loadTasks();
  }

  addTask(taskForm: NgForm){
    if(taskForm.valid){
      this.http.post<TaskResponse>("https://api.todoist.com/rest/v2/tasks", JSON.stringify(this.taskForm), {
      headers: {
        "Authorization":"Bearer 4073e1ba35bd897d02b44a5ac75b019d0688be37",
        "Content-Type": "application/json",
        "X-Request-Id": "2335869742"
      }
    }).pipe(
      tap( newTask => {
        const currentTasks: TaskResponse[] = this.listSubject.getValue()
        this.listSubject.next([...currentTasks, newTask])
      })
    ).subscribe()
  }
}

  loadTasks(){
    this.http.get<TaskResponse[]>("https://api.todoist.com/rest/v2/tasks", {
      headers: {
        "Authorization":"Bearer 4073e1ba35bd897d02b44a5ac75b019d0688be37",
        "Content-Type": "application/json",
        "X-Request-Id": "2335869742"
      }
    }).pipe(
      tap( tasks => this.listSubject.next(tasks) )
    ).subscribe()
  }

}
