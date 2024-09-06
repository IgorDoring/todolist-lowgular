import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskResponse } from '../../model/task';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TaskService } from '../service/task.service';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [HttpClientModule],
  providers: [TaskService],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss'
})
export class TaskDetailComponent {
  task$!: Observable<TaskResponse>
  
}
