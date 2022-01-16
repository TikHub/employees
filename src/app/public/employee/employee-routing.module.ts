import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeesComponent } from '../epmloyees/employees.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: EmployeesComponent,
      },
      {
        path: 'edit/:id',
        component: EmployeesComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeRoutingModule {}
