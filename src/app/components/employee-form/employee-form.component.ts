import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { DepartmentService } from '../../services/department.service';
import { Employee, Department } from '../../models/employee.model';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-100">
      <!-- Navigation -->
      <nav class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <h1 class="text-xl font-semibold text-gray-900">
                {{ isEditMode() ? 'Edit Employee' : 'Add New Employee' }}
              </h1>
            </div>
            <div class="flex items-center space-x-4">
              <button
                (click)="navigateToEmployees()"
                class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Back to Employees
              </button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <div class="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <form
              [formGroup]="employeeForm"
              (ngSubmit)="onSubmit()"
              class="space-y-6"
            >
              <!-- Personal Information -->
              <div>
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Personal Information
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      for="firstName"
                      class="block text-sm font-medium text-gray-700"
                      >First Name *</label
                    >
                    <input
                      type="text"
                      id="firstName"
                      formControlName="firstName"
                      class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      [class.border-red-500]="
                        employeeForm.get('firstName')?.invalid &&
                        employeeForm.get('firstName')?.touched
                      "
                    />
                    <div
                      *ngIf="
                        employeeForm.get('firstName')?.invalid &&
                        employeeForm.get('firstName')?.touched
                      "
                      class="text-red-600 text-sm mt-1"
                    >
                      First name is required
                    </div>
                  </div>

                  <div>
                    <label
                      for="lastName"
                      class="block text-sm font-medium text-gray-700"
                      >Last Name *</label
                    >
                    <input
                      type="text"
                      id="lastName"
                      formControlName="lastName"
                      class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      [class.border-red-500]="
                        employeeForm.get('lastName')?.invalid &&
                        employeeForm.get('lastName')?.touched
                      "
                    />
                    <div
                      *ngIf="
                        employeeForm.get('lastName')?.invalid &&
                        employeeForm.get('lastName')?.touched
                      "
                      class="text-red-600 text-sm mt-1"
                    >
                      Last name is required
                    </div>
                  </div>
                </div>
              </div>

              <!-- Contact Information -->
              <div>
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Contact Information
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      for="email"
                      class="block text-sm font-medium text-gray-700"
                      >Email *</label
                    >
                    <input
                      type="email"
                      id="email"
                      formControlName="email"
                      class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      [class.border-red-500]="
                        employeeForm.get('email')?.invalid &&
                        employeeForm.get('email')?.touched
                      "
                    />
                    <div
                      *ngIf="
                        employeeForm.get('email')?.invalid &&
                        employeeForm.get('email')?.touched
                      "
                      class="text-red-600 text-sm mt-1"
                    >
                      <span
                        *ngIf="employeeForm.get('email')?.errors?.['required']"
                        >Email is required</span
                      >
                      <span *ngIf="employeeForm.get('email')?.errors?.['email']"
                        >Please enter a valid email</span
                      >
                    </div>
                  </div>

                  <div>
                    <label
                      for="phone"
                      class="block text-sm font-medium text-gray-700"
                      >Phone</label
                    >
                    <input
                      type="tel"
                      id="phone"
                      formControlName="phone"
                      class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <!-- Employment Information -->
              <div>
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Employment Information
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      for="departmentId"
                      class="block text-sm font-medium text-gray-700"
                      >Department *</label
                    >
                    <select
                      id="departmentId"
                      formControlName="departmentId"
                      class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      [class.border-red-500]="
                        employeeForm.get('departmentId')?.invalid &&
                        employeeForm.get('departmentId')?.touched
                      "
                    >
                      <option value="">Select Department</option>
                      <option
                        *ngFor="let dept of departments()"
                        [value]="dept.departmentId"
                      >
                        {{ dept.departmentName }}
                      </option>
                    </select>
                    <div
                      *ngIf="
                        employeeForm.get('departmentId')?.invalid &&
                        employeeForm.get('departmentId')?.touched
                      "
                      class="text-red-600 text-sm mt-1"
                    >
                      Department is required
                    </div>
                  </div>

                  <div>
                    <label
                      for="salary"
                      class="block text-sm font-medium text-gray-700"
                      >Salary *</label
                    >
                    <input
                      type="number"
                      id="salary"
                      formControlName="salary"
                      min="0"
                      step="0.01"
                      class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      [class.border-red-500]="
                        employeeForm.get('salary')?.invalid &&
                        employeeForm.get('salary')?.touched
                      "
                    />
                    <div
                      *ngIf="
                        employeeForm.get('salary')?.invalid &&
                        employeeForm.get('salary')?.touched
                      "
                      class="text-red-600 text-sm mt-1"
                    >
                      <span
                        *ngIf="employeeForm.get('salary')?.errors?.['required']"
                        >Salary is required</span
                      >
                      <span *ngIf="employeeForm.get('salary')?.errors?.['min']"
                        >Salary must be positive</span
                      >
                    </div>
                  </div>

                  <div>
                    <label
                      for="hireDate"
                      class="block text-sm font-medium text-gray-700"
                      >Hire Date *</label
                    >
                    <input
                      type="date"
                      id="hireDate"
                      formControlName="hireDate"
                      class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      [class.border-red-500]="
                        employeeForm.get('hireDate')?.invalid &&
                        employeeForm.get('hireDate')?.touched
                      "
                    />
                    <div
                      *ngIf="
                        employeeForm.get('hireDate')?.invalid &&
                        employeeForm.get('hireDate')?.touched
                      "
                      class="text-red-600 text-sm mt-1"
                    >
                      Hire date is required
                    </div>
                  </div>
                </div>
              </div>

              <!-- Status -->
              <div>
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    formControlName="isActive"
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    for="isActive"
                    class="ml-2 block text-sm text-gray-900"
                  >
                    Active Employee
                  </label>
                </div>
              </div>

              <!-- Error Message -->
              <div *ngIf="errorMessage()" class="text-red-600 text-sm">
                {{ errorMessage() }}
              </div>

              <!-- Submit Button -->
              <div class="flex justify-end space-x-3">
                <button
                  type="button"
                  (click)="navigateToEmployees()"
                  class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  [disabled]="employeeForm.invalid || isLoading()"
                  class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{
                    isLoading()
                      ? 'Saving...'
                      : isEditMode()
                      ? 'Update Employee'
                      : 'Add Employee'
                  }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  departments = signal<Department[]>([]);
  isLoading = signal(false);
  isEditMode = signal(false);
  errorMessage = signal('');
  employeeId = signal<number | null>(null);

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      departmentId: ['', [Validators.required]],
      salary: ['', [Validators.required, Validators.min(0)]],
      hireDate: ['', [Validators.required]],
      isActive: [true],
    });
  }

  ngOnInit(): void {
    this.loadDepartments();
    this.checkEditMode();
  }

  checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.employeeId.set(parseInt(id));
      this.loadEmployee(parseInt(id));
    }
  }

  loadEmployee(id: number): void {
    this.employeeService.getEmployee(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const employee = response.data;
          this.employeeForm.patchValue({
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            phone: employee.phone || '',
            departmentId: employee.departmentId,
            salary: employee.salary,
            hireDate: this.formatDateForInput(employee.hireDate),
            isActive: employee.isActive,
          });
        }
      },
      error: (error) => {
        console.error('Error loading employee:', error);
        this.errorMessage.set('Error loading employee data');
      },
    });
  }

  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.departments.set(response.data);
        }
      },
      error: (error) => {
        console.error('Error loading departments:', error);
      },
    });
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');

      const formValue = this.employeeForm.value;
      const employee: Employee = {
        ...formValue,
        hireDate: new Date(formValue.hireDate),
      };

      if (this.isEditMode() && this.employeeId()) {
        this.employeeService
          .updateEmployee(this.employeeId()!, employee)
          .subscribe({
            next: () => {
              this.router.navigate(['/employees']);
            },
            error: (error) => {
              this.errorMessage.set(
                error.error?.message || 'Error updating employee'
              );
              this.isLoading.set(false);
            },
          });
      } else {
        this.employeeService.createEmployee(employee).subscribe({
          next: () => {
            this.router.navigate(['/employees']);
          },
          error: (error) => {
            this.errorMessage.set(
              error.error?.message || 'Error creating employee'
            );
            this.isLoading.set(false);
          },
        });
      }
    }
  }

  private formatDateForInput(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  navigateToEmployees(): void {
    this.router.navigate(['/employees']);
  }
}
