import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/components/dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatSortModule } from '@angular/material/sort';
import { ChartDirective } from './dashboard/directives/chart.directive';
import { CORSInterceptor } from './interceptors/cors.interceptor';
import { LocationTableComponent } from './dashboard/components/location-table/location-table.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LocationTableComponent,
    ChartDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatTableModule,
    MatCardModule,
    MatSortModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: CORSInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
