# Employee Management System - Frontend

A modern Angular 20 frontend application for managing employee records and departments. Built with standalone components, reactive forms, and JWT authentication.

## Features

### Authentication

- JWT token-based authentication
- Login page with form validation
- Route guards for protected routes
- Automatic token handling with HTTP interceptors

### Dashboard

- Statistics cards showing total employees, departments, active employees, and average salary
- Quick action buttons for navigation
- Responsive design with Tailwind CSS

### Employee Management

- Employee list with search and filter functionality
- Pagination support
- Add/Edit employee forms with comprehensive validation
- Department dropdown integration
- Status indicators (Active/Inactive)
- Delete confirmation

### Department Management

- Department list with CRUD operations
- Inline add/edit forms
- Delete confirmation
- Description support

### Technical Features

- Angular 20 with standalone components (no modules)
- Reactive forms with validation
- HTTP interceptors for authentication
- Route guards for security
- Responsive UI with Tailwind CSS
- TypeScript interfaces for type safety
- Error handling and loading states

## Prerequisites

- Node.js (v18 or higher)
- Angular CLI (v20)
- Backend API running (see backend setup)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd Employee_Management_System
```

2. Install dependencies:

```bash
npm install
```

3. Update the API URL in the services:

   - Open `src/app/services/auth.service.ts`
   - Open `src/app/services/employee.service.ts`
   - Open `src/app/services/department.service.ts`
   - Update the `API_URL` constant to match your backend URL

4. Start the development server:

```bash
ng serve
```

5. Open your browser and navigate to `http://localhost:4200`

## Project Structure

```
src/app/
├── components/
│   ├── login/                 # Login component
│   ├── dashboard/             # Dashboard with statistics
│   ├── employee-list/         # Employee list with search/filter
│   ├── employee-form/         # Add/Edit employee form
│   └── department-list/       # Department management
├── services/
│   ├── auth.service.ts        # Authentication service
│   ├── employee.service.ts    # Employee CRUD operations
│   └── department.service.ts  # Department CRUD operations
├── models/
│   └── employee.model.ts      # TypeScript interfaces
├── guards/
│   └── auth.guard.ts         # Route protection
├── interceptors/
│   └── auth.interceptor.ts   # JWT token interceptor
├── app.routes.ts             # Application routes
├── app.config.ts             # App configuration
└── app.ts                    # Root component
```

## API Endpoints

The frontend expects the following API endpoints from your backend:

### Authentication

- `POST /api/auth/login` - User login

### Employees

- `GET /api/employees` - Get employees with pagination/filtering
- `GET /api/employees/{id}` - Get single employee
- `POST /api/employees` - Create employee
- `PUT /api/employees/{id}` - Update employee
- `DELETE /api/employees/{id}` - Delete employee
- `GET /api/employees/stats` - Get employee statistics

### Departments

- `GET /api/departments` - Get all departments
- `GET /api/departments/{id}` - Get single department
- `POST /api/departments` - Create department
- `PUT /api/departments/{id}` - Update department
- `DELETE /api/departments/{id}` - Delete department

## Usage

### Login

1. Navigate to the login page
2. Enter your credentials
3. Upon successful authentication, you'll be redirected to the dashboard

### Dashboard

- View statistics about employees and departments
- Use quick action buttons to navigate to different sections

### Employee Management

- View all employees in a paginated table
- Use search to find employees by name or email
- Filter by department or status
- Click "Add Employee" to create new employees
- Click "Edit" to modify existing employees
- Click "Delete" to remove employees

### Department Management

- View all departments
- Click "Add Department" to create new departments
- Click "Edit" to modify existing departments
- Click "Delete" to remove departments

## Development

### Adding New Features

1. Create new standalone components in the `components/` directory
2. Add corresponding services if needed
3. Update routes in `app.routes.ts`
4. Add TypeScript interfaces in `models/` if needed

### Styling

- The application uses Tailwind CSS for styling
- Custom styles can be added to `src/styles.css`
- Component-specific styles can be added in the component's `styles` array

### State Management

- The application uses Angular signals for reactive state management
- Services handle API communication and data caching
- Local storage is used for authentication tokens

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your backend has CORS configured properly
2. **Authentication Issues**: Check that the JWT token is being sent correctly
3. **API Connection**: Verify the API URL in the services matches your backend
4. **Build Errors**: Make sure all dependencies are installed with `npm install`

### Debug Mode

To enable debug logging, check the browser console for detailed error messages and API responses.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
