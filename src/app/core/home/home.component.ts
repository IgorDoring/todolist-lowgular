import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { TaskResponse } from '../../model/task.model';
import { TaskService } from '../service/task.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterModule],
  providers: [TaskService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
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

  // TODO: remove window.location, not used in SPA
  completeTask(taskId: string) {
    if (confirm('Have you really completed this task?')) {
      this.taskService.completeTask(taskId).subscribe({
        next: () => {
          window.location.reload();
        },
      });
    }
  }
}
