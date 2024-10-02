import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, computed, inject, signal, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskModel, TaskResponse } from '../../model/task.model';
import { TaskService } from '../../service/task.service';
import { RouterModule } from '@angular/router';
import { TaskAddComponent } from '../task-add/task-add.component';
import { TaskSearchComponent } from '../task-search/task-search.component';

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
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  taskService: TaskService = inject(TaskService);
  todolist: Signal<TaskResponse[]> = this.taskService.listSignal;
  sortBy: Signal<string> = signal('');
  filter: Signal<string> = signal('');

  filterTasks() {
    console.log(this.todolist());
    this.todolist = computed(() => {
      return this.taskService
        .listSignal()
        .sort((a: TaskModel, b: TaskModel) => {
          if (this.sortBy() === 'priority') {
            return b.priority - a.priority;
          }
          return a.id.localeCompare(b.id);
        })
        .filter((task) => {
          if (this.filter().trim() !== '') {
            return task.content
              .toLocaleLowerCase()
              .includes(this.filter().toLocaleLowerCase());
          }
          return true;
        });
    });
  }

  completeTask(taskIndex: number) {
    if (confirm('Have you really completed this task?')) {
      this.taskService.completeTask(taskIndex);
    }
  }
}
