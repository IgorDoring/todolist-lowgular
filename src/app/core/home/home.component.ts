import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { TaskResponse } from '../../model/task.model';
import { TaskService } from '../service/task.service';
import { RouterModule } from '@angular/router';
import { TaskAddComponent } from '../task-add/task-add.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    TaskAddComponent,
  ],
  providers: [TaskService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  taskService: TaskService = inject(TaskService);
  taskForm = { project_id: this.taskService.projectId, content: '' };
  todolist$: Observable<TaskResponse[]> =
    this.taskService.listSubject.asObservable();

  ngOnInit(): void {
    this.taskService.loadTasks();
  }

  addTask(taskForm: NgForm) {
    if (taskForm.valid) {
      this.taskService.addTask(JSON.stringify(this.taskForm)).subscribe();
    }
  }

  completeTask(taskId: string) {
    if (confirm('Have you really completed this task?')) {
      this.taskService.completeTask(taskId).subscribe({
        next: () => this.taskService.loadTasks(),
      });
    }
  }
}
