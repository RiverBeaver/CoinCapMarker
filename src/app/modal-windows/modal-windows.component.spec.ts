import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalWindowsComponent } from './modal-windows.component';

describe('ModalWindowsComponent', () => {
  let component: ModalWindowsComponent;
  let fixture: ComponentFixture<ModalWindowsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalWindowsComponent]
    });
    fixture = TestBed.createComponent(ModalWindowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
