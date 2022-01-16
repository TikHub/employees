import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Add.DialogComponent } from './add.dialog.component';

describe('Add.DialogComponent', () => {
  let component: Add.DialogComponent;
  let fixture: ComponentFixture<Add.DialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Add.DialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Add.DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
