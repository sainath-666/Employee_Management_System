import {
  Component,
  OnInit,
  signal,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { DepartmentService } from '../../services/department.service';
import { AuthService } from '../../services/auth.service';
import { Employee, Department } from '../../models/employee.model';
import { Chart, ChartConfiguration } from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  standalone: true,
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('deptChart') deptChart!: ElementRef;
  private chart: Chart | null = null;
  stats = signal<any>({});
  currentUser = signal<any>(null);

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private authService: AuthService,
    private router: Router
  ) {
    // Listen to the router events to refresh stats when navigation occurs
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.loadStats();
      }
    });
  }

  ngOnInit(): void {
    this.loadStats();
    this.currentUser.set(this.authService.currentUser());
  }

  // Navigation methods
  navigateToEmployees(): void {
    this.router.navigate(['/employees']);
  }

  navigateToDepartments(): void {
    this.router.navigate(['/departments']);
  }

  navigateToAddEmployee(): void {
    this.router.navigate(['/employees/add']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  loadStats(): void {
    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.departmentService.getDepartments().subscribe({
          next: (departments) => {
            const stats = {
              totalEmployees: employees.length,
              totalDepartments: departments.length,
              activeEmployees: employees.filter((emp) => emp.isActive).length,
              averageSalary:
                employees.length > 0
                  ? Math.round(
                      employees.reduce((sum, emp) => sum + emp.salary, 0) /
                        employees.length
                    )
                  : 0,
              departmentBreakdown: departments.map((dept) => ({
                name: dept.departmentName,
                count: employees.filter(
                  (emp) => emp.departmentId === dept.departmentId
                ).length,
              })),
            };
            this.stats.set(stats);
            this.updateChart();
          },
          error: (error) => {
            console.error('Error loading departments:', error);
            this.stats.set({ error: 'Failed to load statistics' });
          },
        });
      },
      error: (error) => {
        console.error('Error loading employees:', error);
        this.stats.set({ error: 'Failed to load statistics' });
      },
    });
  }

  ngAfterViewInit(): void {
    this.initializeChart();
  }

  private initializeChart(): void {
    if (this.deptChart && this.stats()) {
      this.updateChart();
    }
  }

  private updateChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = this.deptChart.nativeElement.getContext('2d');
    interface DepartmentBreakdown {
      name: string;
      count: number;
    }
    const departmentData: DepartmentBreakdown[] =
      this.stats().departmentBreakdown || [];

    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: departmentData.map((dept) => dept.name),
        datasets: [
          {
            data: departmentData.map((dept) => dept.count),
            backgroundColor: [
              '#4F46E5', // Indigo
              '#10B981', // Green
              '#3B82F6', // Blue
              '#F59E0B', // Yellow
              '#EF4444', // Red
              '#8B5CF6', // Purple
              '#EC4899', // Pink
              '#14B8A6', // Teal
              '#F97316', // Orange
              '#64748B', // Slate
              '#D97706', // Amber
              '#FBBF24', // Gold
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              font: {
                size: 14,
              },
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                const total = (context.dataset.data as number[]).reduce(
                  (a, b) => a + b,
                  0
                );
                const percentage = ((value / total) * 100).toFixed(1);
                return `${context.label}: ${value} (${percentage}%)`;
              },
            },
          },
        },
      },
    });
  }
}
