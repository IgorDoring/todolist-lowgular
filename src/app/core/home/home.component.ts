import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  Component,
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
import { TaskSearchComponent } from '../task-search/task-search.component';
import { TaskEditComponent } from '../task-edit/task-edit.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    TaskAddComponent,
    TaskSearchComponent,
    TaskEditComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  taskService: TaskService = inject(TaskService);
  todolist: Signal<TaskModel[]> = this.taskService.todolist;
  taskAction: WritableSignal<{ task: TaskModel; action: string }> = signal({
    task: {} as TaskModel,
    action: '',
  });

  showMoreDetails(task: TaskModel) {
    this.taskAction.set({ task: task, action: 'details' });
  }

  hideDetails() {
    this.taskAction.set({ task: {} as TaskModel, action: '' });
  }

  editTask(task: TaskModel) {
    this.taskAction.set({ task: task, action: 'edit' });
  }

  onEditedTask() {
    this.taskAction.set({ task: {} as TaskModel, action: '' });
  }

  completeTask(taskIndex: string) {
    if (confirm('Have you really completed this task?')) {
      this.taskService.completeTask(taskIndex);
    }
  }
}
