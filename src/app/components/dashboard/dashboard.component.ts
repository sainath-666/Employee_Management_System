import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { DepartmentService } from '../../services/department.service';
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
    private departmentService: DepartmentService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStats();
    this.currentUser.set(this.authService.currentUser());
  }

  loadStats(): void {
    // Get employees and departments to calculate stats
    this.employeeService.getEmployees(1, 1000).subscribe({
      next: (employeeResponse) => {
        this.departmentService.getDepartments().subscribe({
          next: (departmentResponse) => {
            if (employeeResponse.success && departmentResponse.success) {
              const employees = employeeResponse.data || [];
              const departments = departmentResponse.data || [];

              const stats = {
                totalEmployees: employees.length,
                totalDepartments: departments.length,
                activeEmployees: employees.filter((emp: any) => emp.isActive)
                  .length,
                averageSalary:
                  employees.length > 0
                    ? Math.round(
                        employees.reduce(
                          (sum: number, emp: any) => sum + emp.salary,
                          0
                        ) / employees.length
                      )
                    : 0,
              };

              this.stats.set(stats);
            }
          },
          error: (error) => {
            console.error('Error loading departments:', error);
            this.stats.set({
              totalEmployees: 0,
              totalDepartments: 0,
              activeEmployees: 0,
              averageSalary: 0,
            });
          },
        });
      },
      error: (error) => {
        console.error('Error loading employees:', error);
        this.stats.set({
          totalEmployees: 0,
          totalDepartments: 0,
          activeEmployees: 0,
          averageSalary: 0,
        });
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
