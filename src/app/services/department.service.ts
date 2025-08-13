import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department, ApiResponse } from '../models/employee.model';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private readonly API_URL = 'https://localhost:7194/api';

  constructor(private http: HttpClient) {}

  getDepartments(): Observable<ApiResponse<Department[]>> {
    return this.http.get<ApiResponse<Department[]>>(
      `${this.API_URL}/departments`
    );
  }

  getDepartment(id: number): Observable<ApiResponse<Department>> {
    return this.http.get<ApiResponse<Department>>(
      `${this.API_URL}/departments/${id}`
    );
  }

  createDepartment(
    department: Department
  ): Observable<ApiResponse<Department>> {
    return this.http.post<ApiResponse<Department>>(
      `${this.API_URL}/departments`,
      department
    );
  }

  updateDepartment(
    id: number,
    department: Department
  ): Observable<ApiResponse<Department>> {
    return this.http.put<ApiResponse<Department>>(
      `${this.API_URL}/departments/${id}`,
      department
    );
  }

  deleteDepartment(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(
      `${this.API_URL}/departments/${id}`
    );
  }
}
