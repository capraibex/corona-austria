import { Component, OnInit } from '@angular/core';

import { DataService } from '../../services/data.service';
import { IDataSeriesItem } from '../../directives/IDataSeriesItem';

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
    this.dataService.getBundesland().subscribe((r) => { this.chartData.bundesland = [{ type: 'column', color: '#73bf69', dataPoints: r }] });
    this.dataService.getBezirke().subscribe((r) => { this.chartData.bezirke = [{ type: 'table', dataPoints: r }] });
    this.dataService.getGeschlechtsverteilung().subscribe((r) => { this.chartData.geschlechtsverteilung = [{ type: 'pie', dataPoints: r }] });
    this.dataService.getAltersverteilung().subscribe((r) => { this.chartData.altersverteilung = [{ type: 'column', color: '#e55400', dataPoints: r }] });
    this.dataService.getTrend().subscribe((r) => { this.chartData.trend = [{ type: 'line', dataPoints: r }] });
    this.dataService.getSimpleData().subscribe((r) => { this.data.simpleData = r });
    this.dataService.getMetaData().subscribe((r) => { this.data.getMetaData = r });
  }
}
