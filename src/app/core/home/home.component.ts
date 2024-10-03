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
  todolist: Signal<TaskModel[]> = computed(() => {
    return this.taskService.listSignal();
  });
  sortBy: Signal<string> = signal('');
  filter: Signal<string> = signal('');
  taskDetails: WritableSignal<string> = signal('');
  liveEditTask: WritableSignal<TaskModel> = signal({} as TaskModel);
  taskForm: { id: string; content: string; priority: number } = {
    id: '',
    content: '',
    priority: 0,
  };

  filterTasks() {
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

  onSubmit(taskForm: NgForm) {
    console.log(JSON.stringify(this.taskForm));
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

  completeTask(taskIndex: number) {
    if (confirm('Have you really completed this task?')) {
      this.taskService.completeTask(taskIndex);
    }
  }
}
