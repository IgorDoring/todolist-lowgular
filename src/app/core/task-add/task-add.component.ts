import { Component, inject } from '@angular/core';
import { TaskService } from '../service/task.service';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-task-add',
  standalone: true,
  imports: [FormsModule],
  providers: [],
  templateUrl: './task-add.component.html',
  styleUrl: './task-add.component.scss',
})
export class TaskAddComponent {
  taskService: TaskService = inject(TaskService);
  taskForm = { project_id: this.taskService.projectId, content: '' };

  addTask(taskForm: NgForm) {
    if (taskForm.valid) {
      this.taskService.addTask(JSON.stringify(this.taskForm)).subscribe();
    }
  }
}
