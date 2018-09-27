import { Routes } from '@angular/router';
import { AreaChartBrushZoomComponent } from './../area-chart-brush-zoom/area-chart-brush-zoom.component';
import { LineChartComponent } from './../line-chart/line-chart.component';
import { WordCloudComponent } from './../word-cloud/word-cloud.component';
import { PieChartComponent } from './../pie-chart/pie-chart.component';
import { StackedChartComponent } from './../stacked-chart/stacked-chart.component';

export const LayoutRoutingModule: Routes = [
  {  path: 'areaChart' , component: AreaChartBrushZoomComponent  },
  {  path: 'lineChart' , component: LineChartComponent  },
  {  path: 'wordCloud' , component: WordCloudComponent  },
  {  path: 'pieChart' , component: PieChartComponent  },
  {  path: 'stackedChart' , component: StackedChartComponent  }
]