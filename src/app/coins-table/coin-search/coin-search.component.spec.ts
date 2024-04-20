import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinSearchComponent } from './coin-search.component';

describe('CoinSearchComponent', () => {
  let component: CoinSearchComponent;
  let fixture: ComponentFixture<CoinSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoinSearchComponent]
    });
    fixture = TestBed.createComponent(CoinSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
