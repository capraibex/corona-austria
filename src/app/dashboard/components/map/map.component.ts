import { Component, OnInit, Input } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';

import * as topojson from 'topojson-client';
import * as d3 from 'd3-selection';
import * as d3Array from 'd3-array';
import * as d3Scale from 'd3-scale';
import * as d3Geo from 'd3-geo';
import * as d3ScaleChromatic from 'd3-scale-chromatic';
import d3Tip from 'd3-tip';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  tooltip: d3Tip.Tooltip ;
  path: d3Geo.GeoPath;
  colorScale: d3Scale.ScaleSequential<string>;

  @Input() data: topojson.Topology;
  @Input() title: string;

  constructor() { }

  ngOnInit(): void {
    this.initTooltip();
    this.initMap();
  }

  initTooltip() {
    this.tooltip = d3Tip()
        .attr('class', 'd3-tip')
        .offset([-5, 0])
        .html((d: topojson.Geometry) => {
            return `${d.properties.name.bold()}
              <br/>Fälle je 100.000: ${(d.properties.Anzahl * 100000 / d.properties.Einwohner).toFixed(2)}
              <br/>Fälle absolut: ${d.properties.Anzahl}`;
        })
  }

  initMap() {
    const featureCollection = topojson.feature(this.data, this.data.objects.bezirke);

    const bounds = d3Geo.geoBounds(featureCollection);
    const centerX = d3Array.sum(bounds, (d) => d[0]) / 2;
    const centerY = d3Array.sum(bounds, (d) => d[1]) / 2;

    const projection = d3Geo.geoMercator()
        .scale(6000)
        .center([centerX, centerY]);

    this.path = d3Geo.geoPath().projection(projection);

    // const domain = d3Array.extent(featureCollection.features.map((d) => (d.properties.Anzahl * 100000 / d.properties.Einwohner))) as [number, number];
    this.colorScale = d3Scale.scaleSequential(d3ScaleChromatic.interpolateReds).domain([0, 500]);

    const svg = d3.select('#map');

    svg.call(this.tooltip)

    svg.selectAll('.map')
        .data(featureCollection.features)
        .enter().append('path')
        .attr('class', 'map')
        .attr('d', this.path)
        .attr('stroke', 'white')
        .on("mouseover", this.tooltip.show)
        .on("mouseout", this.tooltip.hide)
        .attr('fill', function (d: topojson.Geometry) {
            return this.colorScale(d.properties.Anzahl * 100000 / d.properties.Einwohner);
        }.bind(this));
  }

  toggleVisualization(selection: MatRadioChange) {
    if (selection.value === 'relative') {
      d3.selectAll(".map")
          .attr("d", this.path)
          .attr('fill', function (d) {
              return this.colorScale(d.properties.Anzahl * 100000 / d.properties.Einwohner);
          }.bind(this));
    } else {
      d3.selectAll(".map")
          .attr("d", this.path)
          .attr('fill', function (d) {
              return this.colorScale(d.properties.Anzahl);
          }.bind(this));
    }
  }
}
