import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InformationAboutCoinComponent } from './information-about-coin.component';



@NgModule({
  declarations: [
    InformationAboutCoinComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    InformationAboutCoinComponent
  ]
})
export class InformationAboutCoinModule { }
