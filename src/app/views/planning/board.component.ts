import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { Task } from '../../models/task.model';
import { Status } from '../../models/status.model';
import { TaskDetailsModalComponent } from 'src/components/modals/task-details-modal/task-details-modal.component';
import { AddTaskDialogComponent } from 'src/components/modals/add-task-dialog/add-task-dialog.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  tasks: Task[] = [];
  statuses: Status[] = [];

  constructor(private apiService: ApiService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getAllTasks();
    this.getAllStatus();
  }

  getAllTasks(): void {
    console.log('Inside board');
    const projectKey = 'KBN';
    this.apiService.getAllTasks(projectKey).subscribe({
      next: (tasks: Task[]) => {
        this.tasks = tasks;
        console.log('Tasks:', this.tasks); // Optional: Log tasks to console
      },
      error: (error) => {
        console.error('Error fetching tasks:', error);
      },
    });
  }

  getAllStatus(): void {
    this.apiService.getAllStatus().subscribe({
      next: (statuses: Status[]) => {
        this.statuses = statuses;
        console.log('Statuses:', statuses);
      },
      error: (error) => {
        console.error('Error fetching statuses:', error);
      },
    });
  }

  setMaxHeight(): void {
    let maxTaskCount = 0;
    for (const status of this.statuses) {
      const taskCount = this.getTasksByStatus(status).length;
      if (taskCount > maxTaskCount) {
        maxTaskCount = taskCount;
      }
    }
  }

  getTasksByStatus(status: Status): Task[] {
    return this.tasks.filter((task) => task.statusId && task.statusId.id === status.id);
  }

  handleTaskClick(task: Task): void {
    if (task) {
      this.dialog.open(TaskDetailsModalComponent, {
        data: {
          taskSummary: task.summary,
          taskDescription: task.description
        }
      });
    }
  }
  
  handleAddTaskClick(): void {
  }

  openAddTaskDialog(): void {
    const dialogRef = this.dialog.open(AddTaskDialogComponent, {
      width: '400px'
    });

    dialogRef.componentInstance.taskAdded.subscribe((newTask: Task) => {
      if (newTask) {
        this.tasks.push(newTask); // Add the new task to the tasks array
        // Optionally, you can also reload all tasks here if needed
      }
    });
  }
}