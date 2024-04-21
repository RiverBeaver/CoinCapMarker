import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InformationAboutCoinComponent } from './information-about-coin.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { ChartComponent } from './chart/chart.component';
import { ErrorModule } from '../error/error.module';
import { LoadingIndicatorComponent } from '../loading-indicator/loading-indicator.component';



@NgModule({
  declarations: [
    InformationAboutCoinComponent,
    ChartComponent
  ],
  imports: [
    CommonModule,
    HighchartsChartModule,
    ErrorModule,
    LoadingIndicatorComponent
  ],
  exports: [
    InformationAboutCoinComponent
  ]
})
export class InformationAboutCoinModule { }
