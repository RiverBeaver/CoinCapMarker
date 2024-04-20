import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationAboutCoinComponent } from './information-about-coin.component';

describe('InformationAboutCoinComponent', () => {
  let component: InformationAboutCoinComponent;
  let fixture: ComponentFixture<InformationAboutCoinComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InformationAboutCoinComponent]
    });
    fixture = TestBed.createComponent(InformationAboutCoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
