import { Component, OnInit } from '@angular/core';

import { DataService } from '../../services/data.service';
import { forkJoin } from 'rxjs';
import { IDataSeriesItem } from '../../directives/IDataSeriesItem';
import { DataPoint } from '../../DataPoint';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private data = {};
  public chartData: {[type: string]: IDataSeriesItem[]} = {};

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    const simpleData$ = this.dataService.getSimpleData();
    const metaData$ = this.dataService.getMetaData();
    const all$ = this.dataService.getAll();
    forkJoin([simpleData$, metaData$, ...all$]).subscribe(
      ([simpleData, metaData, bundesland, bezirke, geschlechtsverteilung, altersverteilung, trend]) => {
        this.data = {
          ...simpleData, ...metaData, bundesland, bezirke, geschlechtsverteilung, altersverteilung, trend
        };
        this.chartData = {
          altersverteilung: [{ type: 'column', color: '#e55400', dataPoints: altersverteilung as DataPoint[] }],
          bundesland: [{ type: 'column', color: '#73bf69', dataPoints: bundesland as DataPoint[] }],
          trend: [{ type: 'line', dataPoints: trend as DataPoint[] }],
          geschlechtsverteilung: [{ type: 'pie', dataPoints: geschlechtsverteilung as DataPoint[] }],
          bezirke: [{ type: 'table', dataPoints: bezirke as DataPoint[] }],
        };
    });
  }
}
