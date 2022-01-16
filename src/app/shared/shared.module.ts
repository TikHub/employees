import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './components/loader/loader.component';
import { PopupComponent } from './components/popup/popup.component';

import { MaterialModule } from './material.module';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { BaseComponent } from './components/base/base.component';
import { MatConfirmDialogComponent } from './components/mat-confirm-dialog/mat-confirm-dialog.component';

@NgModule({
  declarations: [LoaderComponent, PopupComponent, NotFoundComponent, BaseComponent, MatConfirmDialogComponent],
  imports: [CommonModule, MaterialModule],
  exports: [LoaderComponent, PopupComponent, NotFoundComponent, MaterialModule],
})
export class SharedModule {}
