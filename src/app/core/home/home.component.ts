import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, inject, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  taskService: TaskService = inject(TaskService);
  todolist: Signal<TaskResponse[]> = this.taskService.listSignal;

  completeTask(taskIndex: number) {
    if (confirm('Have you really completed this task?')) {
      this.taskService.completeTask(taskIndex);
    }
  }
}
