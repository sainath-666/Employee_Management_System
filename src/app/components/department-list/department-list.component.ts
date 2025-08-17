import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  OnDestroy,
  WritableSignal,
  computed,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Department, Employee } from '../../models/employee.model';
import { DepartmentService } from '../../services/department.service';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './department-list.component.html',
})
export class DepartmentListComponent implements OnInit, OnDestroy {
  departments: WritableSignal<Department[]> = signal([]);
  employees: WritableSignal<Employee[]> = signal([]);
  private subscriptions = new Subscription();

  filteredDepartments = computed(() => {
    return this.departments().filter(
      (dept) =>
        dept.departmentName
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        dept.description?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  });

  loading = signal(true);
  showForm = signal(false);
  isCardView = signal(true);
  editingDepartment = signal<Department | null>(null);
  searchTerm = '';

  // Stats
  totalEmployees = computed(() => {
    return this.employees().length;
  });

  activeProjects = signal(0); // This would be connected to a ProjectService in a real app

  // Form model
  newDepartment: Department = {
    departmentName: '',
    description: '',
  };

  constructor(
    private departmentService: DepartmentService,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
    this.loadEmployees();
    this.activeProjects.set(12); // Placeholder - would fetch from ProjectService in real app
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  async loadDepartments(): Promise<void> {
    try {
      this.loading.set(true);
      this.subscriptions.add(
        this.departmentService.getDepartments().subscribe({
          next: (deps) => {
            this.departments.set(deps);
          },
          error: (error) => {
            console.error('Error loading departments:', error);
            // TODO: Add proper error handling/notification
          },
          complete: () => {
            this.loading.set(false);
          },
        })
      );
    } catch (error) {
      console.error('Error setting up departments subscription:', error);
      this.loading.set(false);
    }
  }

  loadEmployees(): void {
    this.subscriptions.add(
      this.employeeService.getEmployees().subscribe({
        next: (emps) => {
          this.employees.set(emps);
        },
        error: (error) => {
          console.error('Error loading employees:', error);
          // TODO: Add proper error handling/notification
        },
      })
    );
  }

  showAddForm(): void {
    this.editingDepartment.set(null);
    this.newDepartment = {
      departmentName: '',
      description: '',
    };
    this.showForm.set(true);
  }

  showEditForm(department: Department): void {
    this.editingDepartment.set(department);
    this.newDepartment = { ...department };
    this.showForm.set(true);
  }

  hideForm(): void {
    this.showForm.set(false);
    this.editingDepartment.set(null);
  }

  async onSubmit(): Promise<void> {
    try {
      if (this.editingDepartment()) {
        await this.departmentService
          .updateDepartment(
            this.editingDepartment()!.departmentId!,
            this.newDepartment
          )
          .toPromise();
      } else {
        await this.departmentService
          .createDepartment(this.newDepartment)
          .toPromise();
      }
      this.loadDepartments();
      this.hideForm();
    } catch (error) {
      console.error('Error saving department:', error);
      // TODO: Add proper error handling/notification
    }
  }

  async deleteDepartment(id: number): Promise<void> {
    if (!confirm('Are you sure you want to delete this department?')) {
      return;
    }

    try {
      await this.departmentService.deleteDepartment(id).toPromise();
      this.loadDepartments();
    } catch (error) {
      console.error('Error deleting department:', error);
      // TODO: Add proper error handling/notification
    }
  }

  getDepartmentEmployeeCount(departmentId: number): number {
    return this.employees().filter((emp) => emp.departmentId === departmentId)
      .length;
  }

  toggleViewMode(): void {
    this.isCardView.update((current) => !current);
  }

  onSearch(): void {
    // The filtering is handled by the computed property filteredDepartments
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
