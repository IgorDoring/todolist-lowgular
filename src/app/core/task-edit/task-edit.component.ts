import { Component, inject, Input } from '@angular/core';
import { TaskService } from '../service/task.service';
import { TaskResponse } from '../../model/task.model';
import { Observable, tap } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-task-edit',
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterModule, FormsModule],
  providers: [TaskService],
  templateUrl: './task-edit.component.html',
  styleUrl: './task-edit.component.scss',
})
export class TaskEditComponent {
  taskService: TaskService = inject(TaskService);
  router: Router = inject(Router);
  task$!: Observable<TaskResponse>;
  taskForm!: { id: string; content: string };

  @Input() set id(id: string) {
    this.task$ = this.taskService.loadTask(id).pipe(
      tap((task) => {
        this.taskForm = {
          id: task.id,
          content: task.content,
        };
      }),
    );
  }

  onSubmit(taskForm: NgForm) {
    if (taskForm.valid) {
      this.taskService
        .editTask(this.taskForm.id, JSON.stringify(this.taskForm))
        .subscribe({
          next: (task) => {
            this.router.navigate(['/', 'details', task.id]);
          },
        });
    }
  }
}
