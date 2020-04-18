import { Component, OnInit } from '@angular/core';

import { DataService } from '../../services/data.service';
import { IDataSeriesItem } from '../../directives/IDataSeriesItem';
import { IMetaData } from '../../IMetaData';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private data: {[type: string]: object} = {};
  public chartData: {[type: string]: IDataSeriesItem[] | JSON} = {};

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.dataService.getGeographicData().subscribe((r) => { this.chartData.topology = r; })
    this.dataService.getBezirke().subscribe((r) => { this.chartData.bezirke = [{ type: 'table', dataPoints: r }] });
    this.dataService.getAltersverteilung().subscribe((r) => { this.chartData.altersverteilung = [{ type: 'column', color: '#e55400', dataPoints: r }] });
    this.dataService.getEpikurve().subscribe((r) => { this.chartData.epikurve = [{ type: 'line', dataPoints: r }] });
    this.dataService.getSimpleData().subscribe((r) => { this.data.simpleData = r });
    this.dataService.getMetaData().subscribe((r) => {
      this.preparePositivGetestet(r);
      this.prepareBundesland(r);
    });
  }

  preparePositivGetestet(metaData: IMetaData) {
    const intensivstationTotal = metaData["Intensivstation*"].pop();
    intensivstationTotal.label = 'auf Intensivstation';
    const hospitalisiertTotal = metaData["Hospitalisierung*"].pop();
    hospitalisiertTotal.label = 'hospitalisiert';
    hospitalisiertTotal.y -= intensivstationTotal.y;
    const bundeslandTotal = metaData["Bestätigte Fälle"].pop();
    bundeslandTotal.label = 'bestätigte Fälle';
    bundeslandTotal.y -= (hospitalisiertTotal.y + intensivstationTotal.y);
    
    this.chartData.positivGetestet = [{ type: 'pie', dataPoints: [bundeslandTotal, hospitalisiertTotal, intensivstationTotal] }];
  }

  prepareBundesland(metaData: IMetaData) {
    metaData["Hospitalisierung*"] = metaData["Hospitalisierung*"].map((d, i) => {
      d.y -= metaData["Intensivstation*"][i].y;
      return d;
    });
    metaData["Bestätigte Fälle"] = metaData["Bestätigte Fälle"].map((d, i) => {
      d.y -= (metaData["Hospitalisierung*"][i].y + metaData["Intensivstation*"][i].y);
      return d;
    });

    this.chartData.bundesland = [
      { type: 'stackedColumn', dataPoints: metaData["Bestätigte Fälle"], name: 'bestätigte Fälle' },
      { type: 'stackedColumn', dataPoints: metaData["Hospitalisierung*"], name: 'hospitalisiert' },
      { type: 'stackedColumn', dataPoints: metaData["Intensivstation*"], name: 'auf Intensivstation' },
    ];
  }
}
