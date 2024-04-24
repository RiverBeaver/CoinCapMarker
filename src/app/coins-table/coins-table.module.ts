import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoinsTableComponent } from './coins-table.component';
import { CoinSearchComponent } from './coin-search/coin-search.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ErrorModule } from '../error/error.module';
import { LoadingIndicatorComponent } from '../loading-indicator/loading-indicator.component';
import { ModalWindowsModule } from '../modal-windows/modal-windows.module';



@NgModule({
  declarations: [
    CoinsTableComponent,
    CoinSearchComponent
  ],
  imports: [
    NgxPaginationModule,
    CommonModule,
    ErrorModule,
    LoadingIndicatorComponent,
    ModalWindowsModule
  ],
  exports: [
    CoinsTableComponent
  ]
})
export class CoinsTableModule { }
