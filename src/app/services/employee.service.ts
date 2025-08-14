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

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.API_URL}/Employees`);
  }

  getEmployee(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.API_URL}/Employees/${id}`);
  }

  createEmployee(employee: Employee): Observable<{ employeeId: number }> {
    return this.http.post<{ employeeId: number }>(
      `${this.API_URL}/Employees`,
      employee
    );
  }

  updateEmployee(
    id: number,
    employee: Employee
  ): Observable<ApiResponse<Employee>> {
    return this.http.put<ApiResponse<Employee>>(
      `${this.API_URL}/Employees/${id}`,
      employee
    );
  }

  deleteEmployee(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(
      `${this.API_URL}/Employees/${id}`
    );
  }
}
