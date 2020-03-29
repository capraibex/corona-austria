import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { ChartDirective } from './directives/chart.directive';



@NgModule({
  declarations: [DashboardComponent, ChartDirective],
  imports: [
    CommonModule,
    MatGridListModule
  ]
})
export class DashboardModule { }
