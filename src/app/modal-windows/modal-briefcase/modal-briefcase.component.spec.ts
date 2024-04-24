import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBriefcaseComponent } from './modal-briefcase.component';

describe('ModalBriefcaseComponent', () => {
  let component: ModalBriefcaseComponent;
  let fixture: ComponentFixture<ModalBriefcaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalBriefcaseComponent]
    });
    fixture = TestBed.createComponent(ModalBriefcaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
