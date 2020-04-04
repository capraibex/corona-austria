import {
  AfterViewInit,
  Input,
  Directive,
  ElementRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import * as CanvasJS from 'src/assets/lib/canvasjs.min';
import { IDataSeriesItem } from './IDataSeriesItem';

@Directive({
  selector: '[appChart]'
})
export class ChartDirective implements AfterViewInit, OnChanges {
  chart: CanvasJS.Chart;

  @Input() chartData: IDataSeriesItem[];
  @Input() title: string;

  constructor(private hostElement: ElementRef) {}

  ngAfterViewInit() {
    const elementId = this.hostElement.nativeElement.id;
    if (!elementId) {
      console.error(
        'Element has no id tag defined. Please apply id and try again.',
        this.hostElement.nativeElement
      );
      return;
    }

    this.chart = new CanvasJS.Chart(elementId, {
      animationEnabled: true,
      exportEnabled: false,
      theme: 'dark2',
      title: { text: this.title, fontFamily: 'calibri', fontSize: 20, fontWeight: 'normal' },
      data: this.chartData
    });
    this.chart.render();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.chart) {
      return;
    }
    let hasChanges = false;

    if (changes.chartData) {
      this.chart.options.data = changes.chartData.currentValue;
      hasChanges = true;
    }

    if (hasChanges) {
      this.chart.render();
    }
  }
}
