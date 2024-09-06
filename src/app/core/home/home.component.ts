import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { TaskResponse } from '../../model/task';
import { TaskService } from '../service/task.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  providers: [TaskService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  taskForm = { project_id: this.taskService.projectId, content: '' };
  todolist$: Observable<TaskResponse[]> =
    this.taskService.listSubject.asObservable();

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.loadTasks();
  }

  addTask(taskForm: NgForm) {
    if (taskForm.valid) {
      this.taskService.addTask(JSON.stringify(this.taskForm));
    }
  }
}
