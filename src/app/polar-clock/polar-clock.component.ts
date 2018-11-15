import { Component, OnInit, ElementRef  , ViewEncapsulation } from '@angular/core';
import { D3Service, D3 } from 'd3-ng2-service';

@Component({
  selector: 'app-polar-clock',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './polar-clock.component.html',
  styleUrls: ['./polar-clock.component.css']
})
export class PolarClockComponent implements OnInit {
  private d3: D3;
  constructor(private d3Service: D3Service, private element: ElementRef) {
    this.d3 = d3Service.getD3();
  }

  ngOnInit() {
    this.polarClock();
  }

  public polarClock() {
    debugger;
    const d3 = this.d3;
    const svg = d3.select('svg#polarClock');
    const width = +svg.attr('width');
    const height = +svg.attr('height');
    const radius = Math.min(width, height) / 1.9;
    const bodyRadius = radius / 23;
    const dotRadius = bodyRadius - 8;
    const pi = Math.PI;
    const fields = [
      {radius: 0.2 * radius, format: d3.timeFormat('%B'),          interval: d3.timeYear},
      {radius: 0.3 * radius, format: formatDate,                   interval: d3.timeMonth},
      {radius: 0.4 * radius, format: d3.timeFormat('%A'),          interval: d3.timeWeek},
      {radius: 0.6 * radius, format: d3.timeFormat('%-H hours'),   interval: d3.timeDay},
      {radius: 0.7 * radius, format: d3.timeFormat('%-M minutes'), interval: d3.timeHour},
      {radius: 0.8 * radius, format: d3.timeFormat('%-S seconds'), interval: d3.timeMinute}
    ];
    const color: any = d3.scaleSequential()
        .domain([0, 100])
        .interpolator(d3.interpolateRainbow);
    const arcBody = d3.arc()
        .startAngle((d: any) =>  bodyRadius / d.radius )
        .endAngle((d: any) => -pi - bodyRadius / d.radius )
        .innerRadius((d: any) => d.radius - bodyRadius )
        .outerRadius((d: any) => d.radius + bodyRadius)
        .cornerRadius(bodyRadius);

    const arcTextPath: any = d3.arc()
        .startAngle((d: any) => -bodyRadius / d.radius)
        .endAngle(-pi)
        .innerRadius((d: any) => d.radius)
        .outerRadius((d: any) => d.radius);

    const g = svg.append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    g.append('g')
        .attr('class', 'tracks')
        .selectAll('circle')
        .data(fields)
        .enter().append('circle')
        .attr('r', function(d) { return d.radius; });

    const body = g.append('g')
        .attr('class', 'bodies')
        .selectAll('g')
        .data(fields)
        .enter().append('g');

    body.append('path')
        .attr('d', (d: any) => {
          return arcBody(d)
              + 'M0,' + (dotRadius - d.radius)
              + 'a' + dotRadius + ',' + dotRadius + ' 0 0,1 0,' + -dotRadius * 2
              + 'a' + dotRadius + ',' + dotRadius + ' 0 0,1 0,' + dotRadius * 2;
        });

    body.append('path')
        .attr('class', 'text-path')
        .attr('id', (d, i) => 'body-text-path-' + i)
        .attr('d', arcTextPath);

    const bodyText = body.append('text')
        .attr('dy', '.35em')
        .append('textPath')
        .attr('xlink:href', (d, i) => '#body-text-path-' + i);
    tick();
    d3.timer(tick);

    function tick() {
      const now = Date.now();
      fields.forEach((d: any) => {
        const start = d.interval(this.now),
            end = d.interval.offset(start, 1);
        d.angle = Math.round((now - this.start) / (this.end - this.start) * 360 * 100) / 100;
      });
      body
        .style('fill', (d: any) => color(d.angle))
        .attr('transform', (d: any) => 'rotate(' + d.angle + ')');
      bodyText
          .attr('startOffset', (d: any, i) => d.angle <= 90 || d.angle > 270 ? '100%' : '0%')
          .attr('text-anchor', (d: any, i) => d.angle <= 90 || d.angle > 270 ? 'end' : 'start' )
          .text(function(d) { return d.format(now); });
    }


    function formatDate(d) {
      d = new Date(d).getDate();
      switch (10 <= d && d <= 19 ? 10 : d % 10) {
        case 1: d += 'st'; break;
        case 2: d += 'nd'; break;
        case 3: d += 'rd'; break;
        default: d += 'th'; break;
      }
      return d;
    }
  }

}
