import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataPoint } from '../DataPoint';
import { bundeslandDict } from './bundeslandDict';
import { IMetaData } from '../IMetaData';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private readonly baseURL = 'https://info.gesundheitsministerium.at/data';

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

  getEpikurve(): Observable<DataPoint[]> {
    const url = `${this.baseURL}/Epikurve.js`;
    return this.http.get(url, { responseType: 'text' }).pipe(map(this.convertToDataPoint.bind(this, 'dpEpikurve')));
  }
  
  getMetaData(): Observable<IMetaData> {
    const url = 'https://www.sozialministerium.at/Informationen-zum-Coronavirus/Neuartiges-Coronavirus-(2019-nCov).html';
    return this.http.get(url, { responseType: 'text'}).pipe(map(this.scrape.bind(this)));
  }

  getGeographicData(): Observable<JSON> {
    const url = `${this.baseURL}/austria_map.json`;
    return this.http.get<JSON>(url, { responseType: 'json'});
  }

  getAll(): Observable<DataPoint[]>[] {
    return [
      this.getBundesland(),
      this.getBezirke(),
      this.getGeschlechtsverteilung(),
      this.getAltersverteilung(),
      this.getEpikurve()
    ];
  }

  convertToDataPoint(varName: string, response: string): DataPoint[] {
    const cleanedResponse = response.split(';\n')[0].replace(`var ${varName} = `, '');
    return JSON.parse(cleanedResponse);
  }

  convertSimpleData(response: string): object {
    const resonses = response.split('\n');
    const erkrankungen = +resonses[0].replace('var Erkrankungen = ', '').replace(';', '');
    const letzteAktualisierung = resonses[1].replace('var LetzteAktualisierung = "', '').replace('";', '');
    return { erkrankungen, letzteAktualisierung };
  }

  scrape(response: string): IMetaData {
    const htmlDocument = new DOMParser().parseFromString(response, 'text/html');
    const htmlTable = htmlDocument.getElementsByClassName('table')[0];
    const jsonTable = this.tableToJson(htmlTable);

    return jsonTable;
  }

  tableToJson(table): IMetaData {
    const data = {};

    let headers: string[] = [];
    for (let i = 0; i < table.rows[0].cells.length; i++) {
      const header: string = table.rows[0].cells[i].innerHTML.replace(/ /gi,'').split('<')[0];
      headers.push(header);
    }

    for (let i = 1; i < table.rows.length; i++) {
      const tableRow = table.rows[i];
      const prop: string = tableRow.cells[0].innerHTML.split('<')[0];
      let rowData: DataPoint[] = [];
      
      for (let j = 1; j < tableRow.cells.length; j++) {
        const dataPoint = { label: bundeslandDict[headers[j]], y: +tableRow.cells[j].innerHTML.replace('.', '') };
        rowData.push(dataPoint);
      }
      data[prop] = rowData;
    }       
    return data as IMetaData;
  }
}
