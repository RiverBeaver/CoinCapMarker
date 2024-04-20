import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxPaginationModule } from 'ngx-pagination';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoinsTableModule } from './coins-table/coins-table.module';
import { CoinInfo } from './entities/services/coin-info.service';
import { CoinsService } from './entities/services/coins.service';
import { InformationAboutCoinModule } from './information-about-coin/information-about-coin.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    NgxPaginationModule,
    BrowserModule,
    AppRoutingModule,
    CoinsTableModule,
    HttpClientModule,
    InformationAboutCoinModule,
  ],
  providers: [CoinsService, CoinInfo],
  bootstrap: [AppComponent]
})
export class AppModule { }
