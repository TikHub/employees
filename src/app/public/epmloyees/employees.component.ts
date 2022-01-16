import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  debounceTime,
  delay,
  distinctUntilChanged,
  filter,
  from,
  fromEvent,
  map,
  of,
  pluck,
  Subject,
  Subscription,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { PageModeEnum } from 'src/app/core/infrastructure/enums';
import { Employee } from 'src/app/core/infrastructure/models/employee.model';
import { EmployeesService } from 'src/app/core/services/employees.service';
import { DialogService } from 'src/app/shared/services/dialog.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
})
export class EmployeesComponent implements OnInit, OnDestroy, AfterViewInit {
  form!: FormGroup;
  selectedEmployee: Employee;
  selectedEmployeeId: number;
  controls: any;
  pageMode: PageModeEnum;
  destroy$: Subject<boolean> = new Subject<boolean>();

  displayedColumns = ['firstName', 'lastName', 'company', 'salary', 'actions'];
  dataSource!: MatTableDataSource<any>;
  keyUpSubscription: Subscription;
  sortedData: Employee[];

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) matSort!: MatSort;
  @ViewChild('search') search!: ElementRef;

  constructor(
    private router: Router,
    private employeesService: EmployeesService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private dialogServce: DialogService
  ) {}

  ngOnInit() {
    this.setPageMode();
    this.employeesService.employees$.subscribe((response: Employee[]) => {
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.matSort;
    });
    switch (this.pageMode) {
      case PageModeEnum.list:
        this.getInintialDetailsData();
        break;
      case PageModeEnum.edit:
        this.getDetailsData();
        break;
    }
    this.employeesService.employees$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.dataSource = new MatTableDataSource(res);
      });
  }

  ngAfterViewInit(): void {
    // RECHECK
    this.keyUpSubscription = fromEvent(this.search.nativeElement, 'keyup')
      .pipe(
        debounceTime(500),
        map((event: any) => {
          return (<HTMLInputElement>event.target).value;
        }),
        // tap((el: string) => console.log('ELEMENT', el)),
        distinctUntilChanged(),
        switchMap((data: string) => {
          return this.filterDataSource(data);
        })
      )
      .subscribe((data: string) => {
        console.log('data: ', data, this.dataSource.data);
        this.dataSource.filter = data;
      });
  }

  filterDataSource(data: string) {
    return of(data);
  }

  private setPageMode(): void {
    const url = this.router.url;
    if (url.includes('edit')) {
      this.pageMode = PageModeEnum.edit;
    } else {
      this.pageMode = PageModeEnum.list;
    }
  }

  private getInintialDetailsData() {
    this.activatedRoute.paramMap
      .pipe(
        tap(() => {
          this.selectedEmployeeId = 0;
        })
      )
      .subscribe(() => {
        this.initForm();
      });
  }

  private getDetailsData() {
    this.activatedRoute.paramMap
      .pipe(
        tap((params) => {
          // strictNullChecks
          // this.selectedEmployeeId = +params.get('id');
          this.selectedEmployeeId = +(<string>params.get('id'));
        }),
        // switchMapTo
        switchMap(() => {
          return this.employeesService.getEmployeeById(this.selectedEmployeeId);
        })
      )
      .subscribe((res: Employee) => {
        this.selectedEmployee = res;
        this.initForm();
      });
  }

  private initForm(): void {
    this.form = this.fb.group({
      firstName: [
        this.selectedEmployee && this.selectedEmployee.firstName
          ? this.selectedEmployee.firstName
          : '',
        Validators.compose([Validators.required]),
      ],
      lastName: [
        this.selectedEmployee && this.selectedEmployee.lastName
          ? this.selectedEmployee.lastName
          : '',
        Validators.compose([Validators.required]),
      ],
      company: [
        this.selectedEmployee && this.selectedEmployee.company
          ? this.selectedEmployee.company
          : '',
        Validators.compose([Validators.required]),
      ],
      salary: [
        this.selectedEmployee && this.selectedEmployee.salary
          ? this.selectedEmployee.salary
          : '',
        Validators.compose([Validators.required]),
      ],
    });
    this.setControls();
    this.form.enable();
  }

  setControls() {
    this.controls = {
      firstName: this.form.get('firstName'),
      lastName: this.form.get('lastName'),
      company: this.form.get('company'),
      salary: this.form.get('salary'),
    };
  }

  filterData($event: KeyboardEvent): void {
    // fromEvent(this.searchField.nativeElement, 'input')
    //   .pipe(
    //     map((event: any) => event.target.value),
    // pluck('target', 'value'),
    // filter((searchValue: any) => searchValue.length > 1),
    //   debounceTime(500),
    //   distinctUntilChanged()
    // )
    // .subscribe((res) => {
    //   console.log(res);
    //   this.dataSource.filter = res;
    // });
    // this.dataSource.filter = $event.target.value;
  }

  onSubmit(employee: Employee) {
    employee.id = this.selectedEmployeeId;
    // this.setPageMode();
    if (this.pageMode === 1) {
      const date = new Date();
      employee.id = date.getTime();
      this.employeesService.addEmployee(employee);
    } else {
      this.employeesService.updateEmployee(employee);
    }

    this.form.reset();
    this.router.navigate([`employees/`]);
  }

  edit(ev: MouseEvent, employee: Employee) {
    const id = employee.id;
    this.router.navigate([`employees/edit/${id}`]);
  }

  removalRequest(el: Employee) {
    this.dialogServce
      .openConfirmDialog('Are you sure to delete this employee?')
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.remove(el);
        }
      });
  }

  remove(el: Employee) {
    this.employeesService.removeEmployeeById(el.id);
    this.form.reset();
    this.router.navigate([`employees/`]);
  }

  sortData(sort: Sort) {
    const data = this.dataSource.data.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'firstName':
          return compare(a.firstName, b.firstName, isAsc);
        case 'lastName':
          return compare(a.lastName, b.lastName, isAsc);
        case 'company':
          return compare(a.company, b.company, isAsc);
        case 'salary':
          return compare(a.salary, b.salary, isAsc);
        default:
          return 0;
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
