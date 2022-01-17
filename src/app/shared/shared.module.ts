import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './components/loader/loader.component';

import { MaterialModule } from './material.module';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { MatConfirmDialogComponent } from './components/mat-confirm-dialog/mat-confirm-dialog.component';

@NgModule({
  declarations: [LoaderComponent, NotFoundComponent, MatConfirmDialogComponent],
  imports: [CommonModule, MaterialModule],
  exports: [LoaderComponent, NotFoundComponent, MaterialModule],
})
export class SharedModule {}
