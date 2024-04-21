import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Subscription } from 'rxjs';
import { ChartService } from 'src/app/entities/services/chart.service';
import { LoadingService } from 'src/app/entities/services/loading.service';
import { VisualChartsService } from 'src/app/entities/services/visual-charts.service';

@Component({
  selector: 'chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: any;
  private subscription!: Subscription;
  public chartPoints!: number[][];
  @Input() id!: string;
  @Input() name!: string;
  @Output() error = new EventEmitter<HttpErrorResponse>();

  constructor(
    private chartService: ChartService,
    private visualChartsService: VisualChartsService){
  }

  ngOnInit(): void {
    this.getChartPoints('m5', 1, [ 'hour', [2]]);
  }

  public getChartPoints(interval:string, days: number, unit: [string, number[]]) {
    this.subscription = this.chartService.getChart(this.id, interval, days).subscribe({next:(data: number[][]) => {
      this.chartPoints = data;
      this.chartOptions = this.visualChartsService.getChartOptions(this.name, this.chartPoints, unit);
      this.subscription.unsubscribe();
    },
    error: (error:HttpErrorResponse) => {
      this.error.emit(error)
    }})
  }
  changeBar(event: Event) {
    switch ((event.target as HTMLSelectElement).value) {
      case 'd1': this.getChartPoints('m5', 1, [ 'hour', [2]]);
        break;
      case 'd7': this.getChartPoints('m15', 7, [ 'hour', [12]]);
        break;
      case 'm1': this.getChartPoints('h1', 30, [ 'day', [2]]);
    }
  }
}
