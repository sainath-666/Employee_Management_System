import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DepartmentService } from '../../services/department.service';
import { Department } from '../../models/employee.model';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-100">
      <!-- Navigation -->
      <nav class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <h1 class="text-xl font-semibold text-gray-900">
                Department Management
              </h1>
            </div>
            <div class="flex items-center space-x-4">
              <button
                (click)="navigateToDashboard()"
                class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </button>
              <button
                (click)="showAddForm()"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Add Department
              </button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <!-- Add/Edit Department Form -->
        <div *ngIf="showForm()" class="bg-white shadow rounded-lg mb-6">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
              {{
                editingDepartment() ? 'Edit Department' : 'Add New Department'
              }}
            </h3>
            <form (ngSubmit)="onSubmit()" class="space-y-4">
              <div>
                <label
                  for="departmentName"
                  class="block text-sm font-medium text-gray-700"
                  >Department Name *</label
                >
                <input
                  type="text"
                  id="departmentName"
                  [(ngModel)]="formData.departmentName"
                  name="departmentName"
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  for="description"
                  class="block text-sm font-medium text-gray-700"
                  >Description</label
                >
                <textarea
                  id="description"
                  [(ngModel)]="formData.description"
                  name="description"
                  rows="3"
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                ></textarea>
              </div>
              <div class="flex justify-end space-x-3">
                <button
                  type="button"
                  (click)="cancelForm()"
                  class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  [disabled]="!formData.departmentName || isLoading()"
                  class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{
                    isLoading()
                      ? 'Saving...'
                      : editingDepartment()
                      ? 'Update'
                      : 'Add'
                  }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Department List -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div *ngIf="isLoading()" class="flex justify-center py-8">
              <div
                class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"
              ></div>
            </div>

            <div
              *ngIf="!isLoading() && departments().length === 0"
              class="text-center py-8"
            >
              <p class="text-gray-500">No departments found.</p>
            </div>

            <div
              *ngIf="!isLoading() && departments().length > 0"
              class="overflow-x-auto"
            >
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Department Name
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Description
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    *ngFor="let department of departments()"
                    class="hover:bg-gray-50"
                  >
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                    >
                      {{ department.departmentName }}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-900">
                      {{ department.description || 'No description' }}
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2"
                    >
                      <button
                        (click)="editDepartment(department)"
                        class="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                      <button
                        (click)="deleteDepartment(department.departmentId!)"
                        class="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class DepartmentListComponent implements OnInit {
  departments = signal<Department[]>([]);
  isLoading = signal(false);
  showForm = signal(false);
  editingDepartment = signal<Department | null>(null);
  formData = {
    departmentName: '',
    description: '',
  };

  constructor(
    private departmentService: DepartmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.isLoading.set(true);
    this.departmentService.getDepartments().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.departments.set(response.data);
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading departments:', error);
        this.isLoading.set(false);
      },
    });
  }

  showAddForm(): void {
    this.showForm.set(true);
    this.editingDepartment.set(null);
    this.formData = {
      departmentName: '',
      description: '',
    };
  }

  editDepartment(department: Department): void {
    this.showForm.set(true);
    this.editingDepartment.set(department);
    this.formData = {
      departmentName: department.departmentName,
      description: department.description || '',
    };
  }

  cancelForm(): void {
    this.showForm.set(false);
    this.editingDepartment.set(null);
    this.formData = {
      departmentName: '',
      description: '',
    };
  }

  onSubmit(): void {
    if (!this.formData.departmentName) return;

    this.isLoading.set(true);
    const department: Department = {
      departmentName: this.formData.departmentName,
      description: this.formData.description,
    };

    if (this.editingDepartment()) {
      this.departmentService
        .updateDepartment(this.editingDepartment()!.departmentId!, department)
        .subscribe({
          next: () => {
            this.loadDepartments();
            this.cancelForm();
          },
          error: (error) => {
            console.error('Error updating department:', error);
            this.isLoading.set(false);
          },
        });
    } else {
      this.departmentService.createDepartment(department).subscribe({
        next: () => {
          this.loadDepartments();
          this.cancelForm();
        },
        error: (error) => {
          console.error('Error creating department:', error);
          this.isLoading.set(false);
        },
      });
    }
  }

  deleteDepartment(id: number): void {
    if (confirm('Are you sure you want to delete this department?')) {
      this.departmentService.deleteDepartment(id).subscribe({
        next: () => {
          this.loadDepartments();
        },
        error: (error) => {
          console.error('Error deleting department:', error);
        },
      });
    }
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
