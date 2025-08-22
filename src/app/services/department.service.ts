import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department, ApiResponse } from '../models/employee.model';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.API_URL}/Departments`);
  }

  getDepartment(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.API_URL}/Departments/${id}`);
  }

  createDepartment(
    department: Department
  ): Observable<{ departmentId: number }> {
    return this.http.post<{ departmentId: number }>(
      `${this.API_URL}/Departments`,
      department
    );
  }

  updateDepartment(
    id: number,
    department: Department
  ): Observable<ApiResponse<Department>> {
    return this.http.put<ApiResponse<Department>>(
      `${this.API_URL}/Departments/${id}`,
      department
    );
  }

  deleteDepartment(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(
      `${this.API_URL}/Departments/${id}`
    );
  }
}
