import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CoinInBriefcase } from '../entities/classes/coin-in-briefcase.class';
import { Coin } from '../entities/classes/coin.class';

@Component({
  selector: 'modal-windows',
  templateUrl: './modal-windows.component.html',
  styleUrls: ['./modal-windows.component.scss']
})
export class ModalWindowsComponent implements OnChanges {
  @Input() isVisible: boolean = false;
  @Input() coin: Coin | null = null;
  @Input() briefcase: CoinInBriefcase[] | null = null;
  public title: string = '';

  @Output() onClose = new EventEmitter<boolean>();

  close() {
    this.onClose.emit(false);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['coin']) {
      this.title = 'Add Coin';
    } else if (changes['briefcase']) {
      this.title = 'Your Briefcase';
    } else {
      this.title = '';
    }

  }
}
