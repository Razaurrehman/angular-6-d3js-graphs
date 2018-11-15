import { Component, OnInit , ElementRef } from '@angular/core';
import { D3Service, D3 } from 'd3-ng2-service';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {

  constructor(private d3Service: D3Service, private element: ElementRef) {
    this.d3 = d3Service.getD3();
   }
  private d3: D3;
  ngOnInit() {
    this.pieChart();
  }

  public pieChart() {
    const d3 = this.d3;
    const data = [10, 20, 100];
    const width = 960;
    const height = 500;
    const radius = Math.min(width, height) / 2;

const color: any = d3.scaleOrdinal()
    .range(['#98abc5', '#8a89a6', '#7b6888']);

const arc: any = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

const labelArc = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

const pie = d3.pie()
    .sort(null)
    .value((d: any) => d);

const svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height)
  .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

  const g = svg.selectAll('.arc')
      .data(pie(data))
    .enter().append('g')
      .attr('class', 'arc');

  g.append('path')
      .attr('d', arc)
      .style('fill', (d: any) => color(d.data));

  g.append('text')
      .attr('transform', (d: any) =>  'translate(' + labelArc.centroid(d) + ')')
      .attr('dy', '.35em')
      .text((d: any) => d.data);
  }

}
