import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddCoinInBriefcaseComponent } from './modal-add-coin-in-briefcase.component';

describe('ModalAddCoinInBriefcaseComponent', () => {
  let component: ModalAddCoinInBriefcaseComponent;
  let fixture: ComponentFixture<ModalAddCoinInBriefcaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalAddCoinInBriefcaseComponent]
    });
    fixture = TestBed.createComponent(ModalAddCoinInBriefcaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
