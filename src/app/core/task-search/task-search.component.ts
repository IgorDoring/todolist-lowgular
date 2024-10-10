import { Component, inject, Signal } from '@angular/core';
import { TaskService } from '../../service/task.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './task-search.component.html',
  styleUrl: './task-search.component.scss',
})
export class TaskSearchComponent {
  taskService = inject(TaskService);
  sortBy: Signal<string> = this.taskService.sortBy;
  filter: Signal<string> = this.taskService.filter;
}
