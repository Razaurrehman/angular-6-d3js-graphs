import {
  Component,
  OnInit,
  ElementRef,
  ViewEncapsulation,
  AfterViewInit,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import {D3Service, D3, Selection} from 'd3-ng2-service';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Axis from 'd3-axis';
import * as d3Zoom from 'd3-zoom';
import * as d3Brush from 'd3-brush';
import * as d3Array from 'd3-array';
import * as d3TimeFormat from 'd3-time-format';
import { sp500 } from './../area-chart-brush-zoom/data';

export interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface Stock {
  date: Date;
  price: number;
}

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit , AfterViewInit {
  private d3: D3;
  private parentNativeElement: any;

  title = '';
  private margin: Margin;
  private margin2: Margin;

  private width: number;
  private height: number;
  private height2: number;

  private svg: any;     // TODO replace all `any` by the right type
  private x: any;
  private x2: any;
  private y: any;
  private y2: any;

  private xAxis: any;
  private xAxis2: any;
  private yAxis: any;

  private context: any;
  private brush: any;
  private zoom: any;
  private area: any;
  private area2: any;
  private focus: any;

  private tooltip: any;
  private circles: any;

  private parseDate = d3TimeFormat.timeParse('dd-MMM-YYYY');

  constructor(element: ElementRef, d3Service: D3Service) {
    this.d3 = d3Service.getD3();
    this.parentNativeElement = element.nativeElement;
    this.tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);
   }

   ngOnInit() {

  }
  ngAfterViewInit() {
    const d3 = this.d3; // <-- for convenience use a block scope variable
    let d3ParentElement: Selection<any, any, any, any>; // <-- Use the Selection interface (very basic here for illustration only)

    if (this.parentNativeElement !== null) {

      d3ParentElement = d3.select(this.parentNativeElement); // <-- use the D3 select method
      this.initMargins();

      if (sp500) {
        this.initSvg();
        this.drawChart(this.parseData(sp500));
      }

    }

  }

  public refreshChart(data: any) {
    d3.select(this.parentNativeElement).select('svg').remove();
    this.initSvg();
    this.drawChart(this.parseData(sp500));
  }

  private initMargins() {
    this.margin = {top: 100, right: 50, bottom: 110, left: 60};
    this.margin2 = {top: 430, right: 20, bottom: 30, left: 60};
  }

  private parseData(data: any[]): {date: Date, mentions: number}[] {
    return data.map(v => ({date: new Date(v.date), mentions: v.mentions}));
  }

  private initSvg() {
    const width = 900;
    const height = 500;

    this.width = width - this.margin.left - this.margin.right;
    this.height = height - this.margin.top - this.margin.bottom;
    this.height2 = height - this.margin2.top - this.margin2.bottom;
    this.svg = d3.select(this.parentNativeElement)
      .select('div#topicFollowersChartArea')
      .append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', '0 70 900 500');

    this.x = d3Scale.scaleTime().range([0, this.width]);
    this.x2 = d3Scale.scaleTime().range([0, this.width]);
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    this.y2 = d3Scale.scaleLinear().range([this.height2, 0]);

    this.xAxis = d3Axis.axisBottom(this.x);
    this.xAxis2 = d3Axis.axisBottom(this.x2);
    this.yAxis = d3Axis.axisLeft(this.y);

    this.brush = d3Brush.brushX()
      .extent([[0, 0], [this.width, this.height2]])
      .on('brush end', this.brushed.bind(this));

    this.zoom = d3Zoom.zoom()
      .scaleExtent([1, Infinity])
      .translateExtent([[0, 0], [this.width, this.height]])
      .extent([[0, 0], [this.width, this.height]])
      .on('zoom', this.zoomed.bind(this));

    this.area = d3Shape.area()
      .curve(d3Shape.curveMonotoneX)
      .x((d: any) => this.x(d.date))
      .y0(this.height)
      .y1((d: any) => this.y(d.mentions));

    this.area2 = d3Shape.area()
      .curve(d3Shape.curveMonotoneX)
      .x((d: any) => this.x2(d.date))
      .y0(this.height2)
      .y1((d: any) => this.y2(d.mentions));

    this.svg.append('defs').append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', this.width)
      .attr('height', this.height);

    this.focus = this.svg.append('g')
      .attr('class', 'focus')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    this.context = this.svg.append('g')
      .attr('class', 'context')
      .attr('transform', 'translate(' + this.margin2.left + ',' + this.margin2.top + ')');

  }

  private brushed() {
    if (d3.event.sourceEvent &&
      d3.event.sourceEvent.type === 'zoom') {
      return; // ignore brush by zoom
    }
    const s = d3.event.selection || this.x2.range();
    this.x.domain(s.map(this.x2.invert, this.x2));
    this.focus.select('.area').attr('d', this.area);
    this.focus.select('.axis--x').call(this.xAxis);

    this.svg.select('.zoom').call(this.zoom.transform, d3Zoom.zoomIdentity
      .scale(this.width / (0 - s[0]))
      .translate(-s[0], 0));

    const x = this.x;
    const y = this.y;
    this.focus.selectAll('circle').attr('cx', (d) => x(d.date)).attr('cy', (d) => y(d.mentions));
  }

  private zoomed() {
    if (d3.event.sourceEvent &&
      d3.event.sourceEvent.type === 'brush'
    ) {
      return; // ignore zoom-by-brush
    }
    const t = d3.event.transform;
    this.x.domain(t.rescaleX(this.x2).domain());
    this.focus.select('.area').attr('d', this.area);
    this.focus.select('.axis--x').call(this.xAxis);
    this.context.select('.brush').call(this.brush.move, this.x.range().map(t.invertX, t));
    this.focus.append('line')
        .attr('class', 'x-hover-line hover-line')
        .attr('y1', 0)
        .attr('y2', this.height);
    const x = this.x;
    const y = this.y;
    this.focus.selectAll('circle').attr('cx', (d) => x(d.date)).attr('cy', (d) => y(d.mentions));
  }

  private drawChart(data: {date: Date, mentions: number}[]) {
    this.x.domain(d3Array.extent(data, (d) => d.date));
    this.y.domain([0, d3Array.max(data, (d) => d.mentions)]);
    this.x2.domain(this.x.domain());
    this.y2.domain(this.y.domain());
    const tooltip = this.tooltip;
    this.focus.append('path')
      .datum(data)
      .attr('class', 'area')
      .attr('fill', '#ffff')
      .attr('stroke', '#3f51b5')
      .attr('stroke-width', 2 + 'px')
      .attr('d', this.area);
    this.focus.append('g')
      .attr('class', 'axis axis--x')
      .style('font-size', '15px')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(this.xAxis);

    this.focus.append('g')
      .attr('class', 'axis axis--y')
      .style('font-size', '15px')
      .call(this.yAxis);

    this.context.append('path')
      .datum(data)
      .attr('class', 'area')
      .attr('fill', '#fafafa')
      .attr('stroke', '#3f51b5')
      .attr('stroke-width', 2 + 'px')
      .attr('d', this.area2);

    this.context.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + this.height2 + ')')
      .call(this.xAxis2);

    this.context.append('g')
      .attr('fill', '#fafafa')
      .attr('stroke', '#3f51b5')
      .attr('stroke-width', 2 + 'px')
      .call(this.brush)
      .call(this.brush.move, this.x.range());
    const x = this.x;
    const y = this.y;
    // const click = this.topicfollowersClick;
    this.circles = this.focus.selectAll('dot')
      .data(data)
      .enter().append('circle')
      .attr('fill', '#3f51b5')
      .attr('stroke', '#000000')
      .attr('stroke-width', 2 + 'px')
      .attr('r', 2)
      .attr('cx', function(d) { return x(d.date); })
      .attr('cy', function(d) { return y(d.mentions); })
      .on('mouseover', function(d) {
        const html = `
        <strong>${d.date.toDateString()}<br/>
        Mentions | ${d.mentions}</strong>
        `;
        tooltip.transition()
          .duration(200)
          .style('opacity', .8);
        tooltip.html(html)
          .style('left', (d3.event.pageX) + 'px')
          .style('top', (d3.event.pageY - 55) + 'px')
          .style('width', 100 + 'px')
          .style('height', 50 + 'px')
          .style('line-height', 20 + 'px')
          .style('background', 'black')
          .style('color', 'white');

      })
      .on('mouseout', function(d) {
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      }).on('click', function(d) {
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
        // click.emit({
        //   date: new Date('17-Apr-2018')
        // });
      });
  }
}
