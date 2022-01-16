import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Edit.DialogComponent } from './edit.dialog.component';

describe('Edit.DialogComponent', () => {
  let component: Edit.DialogComponent;
  let fixture: ComponentFixture<Edit.DialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Edit.DialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Edit.DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
