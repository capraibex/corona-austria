import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataPoint } from '../DataPoint';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private readonly corsURL = 'https://cors-anywhere.herokuapp.com/';
  private readonly baseURL = `${this.corsURL}https://info.gesundheitsministerium.at/data`;

  constructor(private http: HttpClient) { }

  getSimpleData(): Observable<object> {
    const url = `${this.baseURL}/SimpleData.js`;
    return this.http.get(url, { responseType: 'text' }).pipe(map(this.convertSimpleData.bind(this)));
  }

  getBundesland(): Observable<DataPoint[]> {
    const url = `${this.baseURL}/Bundesland.js`;
    return this.http.get(url, { responseType: 'text' }).pipe(map(this.convertToDataPoint.bind(this, 'dpBundesland')));
  }

  getBezirke(): Observable<DataPoint[]> {
    const url = `${this.baseURL}/Bezirke.js`;
    return this.http.get(url, { responseType: 'text' }).pipe(map(this.convertToDataPoint.bind(this, 'dpBezirke')));
  }

  getGeschlechtsverteilung(): Observable<DataPoint[]> {
    const url = `${this.baseURL}/Geschlechtsverteilung.js`;
    return this.http.get(url, { responseType: 'text' }).pipe(map(this.convertToDataPoint.bind(this, 'dpGeschlechtsverteilung')));
  }

  getAltersverteilung(): Observable<DataPoint[]> {
    const url = `${this.baseURL}/Altersverteilung.js`;
    return this.http.get(url, { responseType: 'text' }).pipe(map(this.convertToDataPoint.bind(this, 'dpAltersverteilung')));
  }

  getTrend(): Observable<DataPoint[]> {
    const url = `${this.baseURL}/Trend.js`;
    return this.http.get(url, { responseType: 'text' }).pipe(map(this.convertToDataPoint.bind(this, 'dpTrend')));
  }

  getMetaData(): Observable<object> {
    const url = `${this.corsURL}https://www.sozialministerium.at/Informationen-zum-Coronavirus/Dashboard/Zahlen-zur-Hospitalisierung`;
    return this.http.get(url, { responseType: 'text'}).pipe(map(this.scrape.bind(this)));
  }

  getAll(): Observable<DataPoint[]>[] {
    return [
      this.getBundesland(),
      this.getBezirke(),
      this.getGeschlechtsverteilung(),
      this.getAltersverteilung(),
      this.getTrend()
    ];
  }

  convertToDataPoint(varName: string, response: string): DataPoint[] {
    const cleanedResponse = response.replace(`var ${varName} = `, '').replace(';', '');
    return JSON.parse(cleanedResponse);
  }

  convertSimpleData(response: string): object {
    const resonses = response.split('\n');
    const erkrankungen = +resonses[0].replace('var Erkrankungen = ', '').replace(';', '');
    const letzteAktualisierung = resonses[1].replace('var LetzteAktualisierung = "', '').replace('";', '');
    return { erkrankungen, letzteAktualisierung };
  }

  scrape(response: string): object {
    const htmlDocument = new DOMParser().parseFromString(response, 'text/html');
    const htmlTable = htmlDocument.getElementsByClassName('table')[0];
    const hospitalisierung = this.parseTable(htmlTable, 1);
    const intensivstation = this.parseTable(htmlTable, 2);
    return { hospitalisierung, intensivstation };
  }

  parseTable(htmlTable, valueIdx: number): DataPoint[] {
    return [...htmlTable.tBodies[0].rows].map(this.mapRow(0, valueIdx));
  }

  mapRow(labelIdx: number, valueIdx: number) {
    return function mapRowToObject({ cells }) {
      return [cells[labelIdx], cells[valueIdx]].reduce((result, cell, i) => {
        const value = cell.innerText;
        const obj = (i === labelIdx) ? { label: value } : { y: +value };
        return Object.assign(result, obj);
      }, {});
    };
  }
}
