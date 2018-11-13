import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolarClockComponent } from './polar-clock.component';

describe('PolarClockComponent', () => {
  let component: PolarClockComponent;
  let fixture: ComponentFixture<PolarClockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolarClockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolarClockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
