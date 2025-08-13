export interface Employee {
  employeeId?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  departmentId: number;
  salary: number;
  hireDate: Date;
  isActive: boolean;
  department?: Department;
}

export interface Department {
  departmentId?: number;
  departmentName: string;
  description?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
  user: {
    username: string;
    role: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}
