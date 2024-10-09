import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  Component,
  computed,
  inject,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TaskModel } from '../../model/task.model';
import { TaskService } from '../../service/task.service';
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
  todolist: Signal<TaskModel[]> = this.taskService.todolist;
  sortBy: Signal<string> = this.taskService.sortBy;
  filter: Signal<string> = this.taskService.filter;
  taskDetails: WritableSignal<string> = signal('');
  liveEditTask: WritableSignal<TaskModel> = signal({} as TaskModel);
  taskForm: { id: string; content: string; priority: number } = {
    id: '',
    content: '',
    priority: 0,
  };

  onSubmit(taskForm: NgForm) {
    if (taskForm.valid) {
      this.taskService.editTask(
        this.taskForm.id,
        JSON.stringify(this.taskForm),
      );
      this.clearEdit();
    }
  }
  editTask(task: TaskModel) {
    this.taskForm.id = task.id;
    this.taskForm.content = task.content;
    this.taskForm.priority = task.priority;
  }

  clearEdit() {
    this.taskForm = { id: '', content: '', priority: 0 };
  }

  showMoreDetails(taskId: string) {
    this.taskDetails.set(taskId);
  }

  hideDetails() {
    this.taskDetails.set('');
  }

  completeTask(taskIndex: string) {
    if (confirm('Have you really completed this task?')) {
      this.taskService.completeTask(taskIndex);
    }
  }
}
