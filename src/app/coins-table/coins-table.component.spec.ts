import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinsTableComponent } from './coins-table.component';

describe('CoinsTableComponent', () => {
  let component: CoinsTableComponent;
  let fixture: ComponentFixture<CoinsTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoinsTableComponent]
    });
    fixture = TestBed.createComponent(CoinsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
