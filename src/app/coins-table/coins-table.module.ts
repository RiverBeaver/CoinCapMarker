import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoinsTableComponent } from './coins-table.component';
import { CoinSearchComponent } from './coin-search/coin-search.component';
import { NgxPaginationModule } from 'ngx-pagination';



@NgModule({
  declarations: [
    CoinsTableComponent,
    CoinSearchComponent
  ],
  imports: [
    NgxPaginationModule,
    CommonModule,
  ],
  exports: [
    CoinsTableComponent
  ]
})
export class CoinsTableModule { }
