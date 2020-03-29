import { Component, OnInit } from '@angular/core';

import { DataService } from '../../services/data.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private data = {};

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
        console.log(this.data)
    });
  }
}
