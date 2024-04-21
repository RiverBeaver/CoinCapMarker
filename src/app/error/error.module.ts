import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from './error.component';
import { LoadingIndicatorComponent } from '../loading-indicator/loading-indicator.component';



@NgModule({
  declarations: [
    ErrorComponent
  ],
  imports: [
    CommonModule,
    LoadingIndicatorComponent
  ],
  exports: [
    ErrorComponent
  ]
})
export class ErrorModule { }
