import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';

import { DataService } from '../../services/data.service';
import { IDataSeriesItem } from '../../directives/IDataSeriesItem';
import { DataPoint } from '../../DataPoint';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private data: {[type: string]: object} = {};
  public chartData: {[type: string]: IDataSeriesItem[]} = {};

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.dataService.getBezirke().subscribe((r) => { this.chartData.bezirke = [{ type: 'table', dataPoints: r }] });
    this.dataService.getAltersverteilung().subscribe((r) => { this.chartData.altersverteilung = [{ type: 'column', color: '#e55400', dataPoints: r }] });
    this.dataService.getTrend().subscribe((r) => { this.chartData.trend = [{ type: 'line', dataPoints: r }] });
    this.dataService.getSimpleData().subscribe((r) => { this.data.simpleData = r });
    forkJoin([this.dataService.getBundesland(), this.dataService.getMetaData()])
      .subscribe(([bundesland, meta]) => {
        this.preparePositivGetestet(bundesland, meta);
        this.prepareBundesland(bundesland, meta);
      });
  }

  preparePositivGetestet(bundesland: DataPoint[], meta: { [key: string]: DataPoint[] }) {
    const intensivstationTotal = meta.intensivstation.pop();
    intensivstationTotal.label = 'auf Intensivstation';
    const hospitalisiertTotal = meta.hospitalisierung.pop();
    hospitalisiertTotal.label = 'hospitalisiert';
    hospitalisiertTotal.y -= intensivstationTotal.y;
    const bundeslandTotal = { 
      label: 'positiv getestet',
      y: bundesland.reduce((a, b) => a + b.y, 0) - hospitalisiertTotal.y - intensivstationTotal.y,
    };

    this.chartData.positivGetestet = [{ type: 'pie', dataPoints: [bundeslandTotal, hospitalisiertTotal, intensivstationTotal] }];
  }

  prepareBundesland(bundesland: DataPoint[], meta: { [key: string]: DataPoint[] }) {
    bundesland = bundesland.sort((a, b) => a.label.localeCompare(b.label));
    meta.hospitalisierung = meta.hospitalisierung.map((d, i) => {
      d.y -= meta.intensivstation[i].y;
      return d;
    });
    bundesland = bundesland.map((d, i) => {
      d.y -= (meta.hospitalisierung[i].y + meta.intensivstation[i].y);
      return d;
    });

    this.chartData.bundesland = [
      { type: 'stackedColumn', dataPoints: bundesland, name: 'postiv getestet' },
      { type: 'stackedColumn', dataPoints: meta.hospitalisierung, name: 'hospitalisiert' },
      { type: 'stackedColumn', dataPoints: meta.intensivstation, name: 'auf Intensivstation' },
    ];
  }
}
