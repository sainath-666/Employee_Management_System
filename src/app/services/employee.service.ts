import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee, ApiResponse } from '../models/employee.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly API_URL = 'https://localhost:7194/api';

  constructor(private http: HttpClient) {}

  getEmployees(
    page: number = 1,
    pageSize: number = 10,
    search?: string,
    departmentId?: number
  ): Observable<ApiResponse<Employee[]>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (search) {
      params = params.set('search', search);
    }

    if (departmentId) {
      params = params.set('departmentId', departmentId.toString());
    }

    return this.http.get<ApiResponse<Employee[]>>(`${this.API_URL}/employees`, {
      params,
    });
  }

  getEmployee(id: number): Observable<ApiResponse<Employee>> {
    return this.http.get<ApiResponse<Employee>>(
      `${this.API_URL}/employees/${id}`
    );
  }

  createEmployee(employee: Employee): Observable<ApiResponse<Employee>> {
    return this.http.post<ApiResponse<Employee>>(
      `${this.API_URL}/employees`,
      employee
    );
  }

  updateEmployee(
    id: number,
    employee: Employee
  ): Observable<ApiResponse<Employee>> {
    return this.http.put<ApiResponse<Employee>>(
      `${this.API_URL}/employees/${id}`,
      employee
    );
  }

  deleteEmployee(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(
      `${this.API_URL}/employees/${id}`
    );
  }

  getEmployeeStats(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.API_URL}/employees/stats`);
  }
}
