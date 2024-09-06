import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskResponse } from '../../model/task';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss'
})
export class TaskDetailComponent {
  http: HttpClient = inject(HttpClient)
  task$!: Observable<TaskResponse>
  
}
