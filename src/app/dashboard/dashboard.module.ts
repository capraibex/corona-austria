import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatSortModule } from '@angular/material/sort';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LocationTableComponent } from './components/location-table/location-table.component';
import { ChartDirective } from './directives/chart.directive';



@NgModule({
  declarations: [DashboardComponent, ChartDirective, LocationTableComponent],
  imports: [
    CommonModule,
    MatGridListModule,
    MatTableModule,
    MatCardModule,
    MatSortModule
  ]
})
export class DashboardModule { }
