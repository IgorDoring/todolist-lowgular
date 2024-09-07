import { Component, inject, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskResponse } from '../../model/task.model';
import { HttpClientModule } from '@angular/common/http';
import { TaskService } from '../service/task.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterModule],
  providers: [TaskService],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss',
})
export class TaskDetailComponent {
  taskService = inject(TaskService);
  task$!: Observable<TaskResponse>;

  @Input() set id(id: string) {
    this.task$ = this.taskService.loadTask(id);
  }
}
