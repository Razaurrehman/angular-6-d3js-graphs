import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutRoutingModule } from './layout-routing.module';
import { SharedModule } from './../shared/shared.module';
import { AreaChartBrushZoomComponent } from './../area-chart-brush-zoom/area-chart-brush-zoom.component';
import { LineChartComponent } from './../line-chart/line-chart.component';
import { WordCloudComponent } from './../word-cloud/word-cloud.component';
import { PieChartComponent } from './../pie-chart/pie-chart.component';
import { StackedChartComponent } from './../stacked-chart/stacked-chart.component';
import { D3Service } from 'd3-ng2-service'; // <-- import statement

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(LayoutRoutingModule),
    SharedModule
  ],
  declarations: [AreaChartBrushZoomComponent, LineChartComponent , WordCloudComponent , PieChartComponent , StackedChartComponent],
  providers: [D3Service]
})
export class LayoutModule { }
