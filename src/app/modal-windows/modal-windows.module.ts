import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalBriefcaseComponent } from './modal-briefcase/modal-briefcase.component';
import { ModalAddCoinInBriefcaseComponent } from './modal-add-coin-in-briefcase/modal-add-coin-in-briefcase.component';
import { ModalWindowsComponent } from './modal-windows.component';



@NgModule({
  declarations: [
    ModalBriefcaseComponent,
    ModalAddCoinInBriefcaseComponent,
    ModalWindowsComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ModalWindowsComponent,
    ModalAddCoinInBriefcaseComponent
  ]
})
export class ModalWindowsModule { }
