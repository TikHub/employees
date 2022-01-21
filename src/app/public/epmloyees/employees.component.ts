import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Subject,
  Subscription,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { PageModeEnum, Urls } from '@core/infrastructure/enums';
import { EmployeeFormModel } from '@core/infrastructure/models';
import { Employee } from '@core/infrastructure/models/employee.model';
import { EmployeesService } from '@core/services/employees.service';
import { compare } from '@shared/helper-functions';
import { DialogService } from '@shared/services/dialog.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
})
export class EmployeesComponent implements OnInit, OnDestroy, AfterViewInit {
  form: FormGroup;
  selectedEmployee: Employee;
  selectedEmployeeId: number;
  controls: EmployeeFormModel;
  pageMode: PageModeEnum;
  destroy$: Subject<boolean> = new Subject<boolean>();

  displayedColumns = ['firstName', 'lastName', 'company', 'salary', 'actions'];
  dataSource!: MatTableDataSource<any>;
  keyUp = new Subject<KeyboardEvent>();
  subscription: Subscription;
  sortedData: Employee[];

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) matSort!: MatSort;
  @ViewChild('search') search!: ElementRef<HTMLInputElement>;

  constructor(
    private router: Router,
    private employeesService: EmployeesService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private dialogServce: DialogService
  ) {}

  ngOnInit() {
    this.setPageMode();

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
      .subscribe((res: Employee[]) => {
        this.dataSource = new MatTableDataSource(res);
      });

    this.subscription = this.keyUp
      .pipe(
        map((event: KeyboardEvent) => (<HTMLInputElement>event.target).value),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((data: string) => {
        this.dataSource.filter = data;
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.matSort;
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
        tap((params: ParamMap) => {
          this.selectedEmployeeId = +(<string>params.get('id'));
        }),
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
      firstName: <FormControl>this.form.get('firstName'),
      lastName: <FormControl>this.form.get('lastName'),
      company: <FormControl>this.form.get('company'),
      salary: <FormControl>this.form.get('salary'),
    };
  }

  onSubmit(employee: Employee) {
    employee.id = this.selectedEmployeeId;
    if (this.pageMode === 1) {
      const date = new Date();
      employee.id = date.getTime();
      this.employeesService.addEmployee(employee);
    } else {
      this.employeesService.updateEmployee(employee);
    }

    this.form.reset();
    this.router.navigate([`${Urls.Employees}/`]);
  }

  edit(event: MouseEvent, employee: Employee) {
    const id = employee.id;
    this.router.navigate([
      `${Urls.Employees}/${PageModeEnum[PageModeEnum.edit]}/${id}`,
    ]);
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
    this.router.navigate([`${Urls.Employees}/`]);
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
    this.subscription.unsubscribe();
  }
}
