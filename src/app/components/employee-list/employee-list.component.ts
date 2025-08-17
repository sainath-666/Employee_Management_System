import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { EmployeeService } from '../../services/employee.service';
import { DepartmentService } from '../../services/department.service';
import { Employee, Department } from '../../models/employee.model';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-list.component.html',
  styles: [],
})
export class EmployeeListComponent implements OnInit {
  employees = signal<Employee[]>([]);
  departments = signal<Department[]>([]);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  currentPage = signal(1);
  pageSize = signal(10);
  totalItems = signal(0);
  searchControl = new FormControl('');
  selectedDepartmentId = signal<number | null>(null);
  selectedStatus = signal<string | null>(null);
  Math = Math;

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
    this.loadDepartments();
    this.setupSearch();
  }

  setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.currentPage.set(1);
        this.loadEmployees();
      });
  }

  getDepartmentName(departmentId: number): string {
    const department = this.departments().find(
      (d) => d.departmentId === departmentId
    );
    return department ? department.departmentName : 'No Department';
  }

  loadEmployees(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.employees.set(employees);
        this.totalItems.set(employees.length);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading employees:', error);
        this.errorMessage.set(
          'Failed to load employees. Please check if the backend server is running.'
        );
        this.isLoading.set(false);
      },
    });
  }

  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (departments) => {
        this.departments.set(departments);
      },
      error: (error) => {
        console.error('Error loading departments:', error);
        this.errorMessage.set(
          'Failed to load departments. Please check if the backend server is running.'
        );
      },
    });
  }

  onDepartmentFilterChange(event: any): void {
    const value = event.target.value;
    this.selectedDepartmentId.set(value ? parseInt(value) : null);
    this.currentPage.set(1);
    this.loadEmployees();
  }

  onStatusFilterChange(event: any): void {
    const value = event.target.value;
    this.selectedStatus.set(value || null);
    this.currentPage.set(1);
    this.loadEmployees();
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
      this.loadEmployees();
    }
  }

  nextPage(): void {
    if (this.currentPage() * this.pageSize() < this.totalItems()) {
      this.currentPage.set(this.currentPage() + 1);
      this.loadEmployees();
    }
  }

  editEmployee(id: number): void {
    this.router.navigate(['/employees/edit', id]);
  }

  deleteEmployee(id: number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          this.loadEmployees();
        },
        error: (error) => {
          console.error('Error deleting employee:', error);
        },
      });
    }
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  navigateToAddEmployee(): void {
    this.router.navigate(['/employees/add']);
  }
}
