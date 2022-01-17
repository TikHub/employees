import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Employee } from '../infrastructure/models/employee.model';
import { employees } from 'src/app/shared/mocked-data';

@Injectable()
export class EmployeesService {
  private employeeList$ = new BehaviorSubject<Employee[]>(employees);
  employees$ = this.employeeList$.asObservable();

  constructor() {}

  addEmployee(employee: Employee) {
    this.employeeList$.next([...this.employeeList$.value, employee]);
  }

  updateEmployee(employee: Employee): void {
    let item: Employee = <Employee>(
      this.employeeList$.value.find((empl: Employee) => empl.id === employee.id)
    );
    Object.assign(item, employee);
  }

  getEmployeeById(id: number): Observable<Employee> {
    return of(
      this.employeeList$.value.filter((employee) => employee.id === id)[0]
    );
  }

  removeEmployeeById(id: number): void {
    const transformedArray = this.employeeList$.value.filter(
      (employee) => employee.id !== id
    );
    this.employeeList$.next(transformedArray);
  }
}
