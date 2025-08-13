import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styles: [],
})
export class DashboardComponent implements OnInit {
  stats = signal<any>({});
  currentUser = signal<any>(null);

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStats();
    this.currentUser.set(this.authService.currentUser());
  }

  loadStats(): void {
    this.employeeService.getEmployeeStats().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.stats.set(response.data);
        }
      },
      error: (error) => {
        console.error('Error loading stats:', error);
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateToEmployees(): void {
    this.router.navigate(['/employees']);
  }

  navigateToDepartments(): void {
    this.router.navigate(['/departments']);
  }

  navigateToAddEmployee(): void {
    this.router.navigate(['/employees/add']);
  }
}
