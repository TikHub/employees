import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Employee } from '../infrastructure/models/employee.model';

@Injectable()
export class EmployeesService {
  private employees: Employee[];
  private employeesList = new BehaviorSubject<Employee[]>([]);
  list = this.employeesList.asObservable();

  constructor(private http: HttpClient) {
    this.employees = [
      {
        id: 1,
        firstName: 'Tom',
        lastName: 'Edwards',
        company: 'EPAM',
        salary: 3000,
      },
      {
        id: 2,
        firstName: 'Andre',
        lastName: 'Jones',
        company: 'Google',
        salary: 2000,
      },
      {
        id: 3,
        firstName: 'Jane',
        lastName: 'Douson',
        company: 'Microsoft',
        salary: 4000,
      },
    ];
    this.employeesList.next(this.employees);
  }

  addEmployee(employee: Employee) {
    this.employees.push(employee);
    this.employeesList.next(this.employees);
  }

  updateEmployee(employee: Employee): void {
    // Use find

    let objIndex = this.employees.findIndex((obj) => obj.id == employee.id);
    let item: Employee = this.employees[objIndex];
    Object.assign(item, employee);
  }

  updateEmployees(list: Employee[]): void {
    this.employeesList.next(list);
  }

  getEmployees(): Observable<Employee[]> {
    // return this.http.get('https://jsonplaceholder.typicode.com/users');
    return of(this.employees);
  }

  getEmployeeById(id: number): Observable<Employee> {
    return of(this.employees.filter((employee) => employee.id === id)[0]);
  }

  removeEmployeeById(id: number): void {
    const transformedArray = this.employees.filter(
      (employee) => employee.id !== id
    );
    this.employees = transformedArray;
    this.employeesList.next(transformedArray);
  }
}
