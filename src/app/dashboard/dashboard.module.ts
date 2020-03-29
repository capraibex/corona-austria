import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MatGridListModule } from '@angular/material/grid-list';



@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    MatGridListModule
  ]
})
export class DashboardModule { }
