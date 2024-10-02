import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, computed, inject, signal, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  todolist: Signal<TaskModel[]> = this.taskService.listSignal;
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
          } else if (this.sortBy() === 'date') {
            const aDate = new Date(a.createdAt);
            const bDate = new Date(b.createdAt);
            return bDate.getTime() - aDate.getTime();
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
