import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { TaskService } from '../../service/task.service';
import { TaskModel } from '../../model/task.model';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-task-edit',
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterModule, FormsModule],
  templateUrl: './task-edit.component.html',
  styleUrl: './task-edit.component.scss',
})
export class TaskEditComponent {
  taskService: TaskService = inject(TaskService);
  taskForm!: { id: string; content: string; priority: number };
  @Output() editedTask = new EventEmitter<boolean>();

  @Input() set task(task: TaskModel) {
    this.taskForm = {
      id: task.id,
      content: task.content,
      priority: task.priority,
    };
  }

  clearEdit() {
    this.taskForm = {
      id: '',
      content: '',
      priority: 0,
    };
  }

  onSubmit(taskForm: NgForm) {
    if (taskForm.valid) {
      this.taskService.editTask(
        this.taskForm.id,
        JSON.stringify(this.taskForm),
      );
      this.clearEdit();
      this.editedTask.emit(true);
    }
  }
}
