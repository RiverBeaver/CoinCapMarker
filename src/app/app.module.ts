import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxPaginationModule } from 'ngx-pagination';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoinsTableModule } from './coins-table/coins-table.module';
import { VisualChartsService } from './entities/services/visual-charts.service';
import { ChartService } from './entities/services/chart.service';
import { CoinInfo } from './entities/services/coin-info.service';
import { CoinsService } from './entities/services/coins.service';
import { InformationAboutCoinModule } from './information-about-coin/information-about-coin.module';
import { RouterLink } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoadingInterceptor } from './entities/interceptors/loading.interceptor';
import { LoadingIndicatorComponent } from './loading-indicator/loading-indicator.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  imports: [
    NgxPaginationModule,
    BrowserModule,
    AppRoutingModule,
    CoinsTableModule,
    HttpClientModule,
    InformationAboutCoinModule,
    RouterLink,
    BrowserAnimationsModule,
    LoadingIndicatorComponent,
    MatProgressSpinnerModule
  ],
  providers: [CoinsService, CoinInfo, ChartService, VisualChartsService, 
    {
    provide: HTTP_INTERCEPTORS,
    useClass: LoadingInterceptor,
    multi: true,
  },
],
  bootstrap: [AppComponent]
})
export class AppModule { }
