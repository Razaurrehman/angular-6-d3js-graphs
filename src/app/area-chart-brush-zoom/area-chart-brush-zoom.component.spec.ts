import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaChartBrushZoomComponent } from './area-chart-brush-zoom.component';

describe('AreaChartBrushZoomComponent', () => {
  let component: AreaChartBrushZoomComponent;
  let fixture: ComponentFixture<AreaChartBrushZoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaChartBrushZoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaChartBrushZoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
