import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { EmployeesComponent } from '../epmloyees/employees.component';
import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeesService } from 'src/app/core/services/employees.service';

// import { StaffComponent } from './staff/staff.component';
// import { AddDialogComponent } from './staff/dialogs/add/add.dialog.component';
// import { DeleteDialogComponent } from './staff/dialogs/delete/delete.dialog.component';
// import { EditDialogComponent } from './staff/dialogs/edit/edit.dialog.component';

@NgModule({
  declarations: [EmployeesComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    EmployeeRoutingModule,
  ],
  providers: [EmployeesService],
})
export class EmployeeModule {}
