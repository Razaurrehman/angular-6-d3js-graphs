import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  tabName = [
    {name: 'AreaChart' , link: '/areaChart'},
    {name: 'Line Chart' , link: '/lineChart'},
    {name: 'Word Cloud' , link: '/wordCloud'},
    {name: 'Pie Chart' , link: '/pieChart'},
    {name: 'stacked Chart' , link: '/stackedChart'},
    {name: 'Polar Clock' , link: '/polarclock'}
  ];
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe( map(result => result.matches));
  constructor(private breakpointObserver: BreakpointObserver) {}
}
