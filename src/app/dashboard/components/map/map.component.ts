import { Component, OnInit, AfterViewInit, Input } from '@angular/core';

import * as L from 'leaflet';
import * as topojson from 'topojson-client';
import austriaMap from 'src/assets/mapdata/austria_map.json';
import { DataPoint } from '../../DataPoint';

export interface IBezirksDictionary { [bezirk: string]: number; }

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {
  private map;
  bezirksDictionary: IBezirksDictionary;
  @Input() data: DataPoint[];

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.bezirksDictionary = this.createDictionary(this.data);
    this.prepareFeatureCollection();
  }

  createDictionary(data: DataPoint[]): IBezirksDictionary {
    return data.reduce((obj, item) => Object.assign(obj, { [item.label]: item.y }), {});
  }

  prepareFeatureCollection() {
    const featureCollection = topojson.feature(austriaMap, austriaMap.objects.bezirke);

    featureCollection.features.forEach(e => {
        if (this.bezirksDictionary[e.properties.name]){
            e.properties['count'] = this.bezirksDictionary[e.properties.name];
        }
    });
    this.initMap(featureCollection);
  }

  private initMap(featureCollection): void {
    this.map = L.map('map', {
      center: [47.5, 13],
      zoom: 6
    });
    L.geoJson(featureCollection).addTo(this.map);
  }
}
