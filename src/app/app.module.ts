import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 
import { DashboardComponent } from './dashboard/components/dashboard/dashboard.component';
import { LocationTableComponent } from './dashboard/components/location-table/location-table.component';
import { MapComponent } from './dashboard/components/map/map.component';
import { ChartDirective } from './dashboard/directives/chart.directive';
import { CORSInterceptor } from './interceptors/cors.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LocationTableComponent,
    MapComponent,
    ChartDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatTableModule,
    MatCardModule,
    MatSortModule,
    MatProgressSpinnerModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: CORSInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
