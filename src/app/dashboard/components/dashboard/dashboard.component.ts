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
    const all$ = this.dataService.getAll();
    forkJoin([simpleData$, ...all$]).subscribe(
      ([simpleData, bundesland, bezirke, geschlechtsverteilung, altersverteilung, trend]) => {
        this.data = {
          ...simpleData, bundesland, bezirke, geschlechtsverteilung, altersverteilung, trend
        };
    });
  }
}
