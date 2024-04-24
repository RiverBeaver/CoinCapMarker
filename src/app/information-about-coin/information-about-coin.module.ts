import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InformationAboutCoinComponent } from './information-about-coin.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { ChartComponent } from './chart/chart.component';
import { ErrorModule } from '../error/error.module';
import { LoadingIndicatorComponent } from '../loading-indicator/loading-indicator.component';
import { ModalWindowsModule } from '../modal-windows/modal-windows.module';



@NgModule({
  declarations: [
    InformationAboutCoinComponent,
    ChartComponent
  ],
  imports: [
    CommonModule,
    HighchartsChartModule,
    ErrorModule,
    LoadingIndicatorComponent,
    ModalWindowsModule
  ],
  exports: [
    InformationAboutCoinComponent,
  ]
})
export class InformationAboutCoinModule { }
