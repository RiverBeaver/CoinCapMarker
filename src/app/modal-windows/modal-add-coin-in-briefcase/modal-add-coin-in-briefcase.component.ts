import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Coin } from 'src/app/entities/classes/coin.class';
import { CoinsInBriefcaseService } from 'src/app/entities/services/coins-in-briefcase.service';

@Component({
  selector: 'modal-add-coin-in-briefcase',
  templateUrl: './modal-add-coin-in-briefcase.component.html',
  styleUrls: ['./modal-add-coin-in-briefcase.component.scss']
})
export class ModalAddCoinInBriefcaseComponent implements OnChanges {
  @Input() coin: Coin | null = null;
  public totalPrice: number = 0;
  public quantity: number = 0;
  public minQuantity: number = 1;

  @Output() onClose = new EventEmitter<boolean>();

  constructor(private coinsInBriefcaseService: CoinsInBriefcaseService){}

  close() {
    this.onClose.emit(false);
  }

  onChangeQuantity(event: Event) {
    console.dir((event.target as HTMLInputElement))
    if (this.coin) {
      if (+(event.target as HTMLInputElement).value <= 0) {
        this.quantity = 1;
        (event.target as HTMLInputElement).value = '1';
      } else this.quantity = +(event.target as HTMLInputElement).value;
      this.totalPrice = this.quantity * +this.coin.priceUsd;
    }
  }

  addInBriefcase() {
    if (this.coin) this.coinsInBriefcaseService.addCoin(this.coin, this.quantity);
    this.close();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.coin) {
      this.minQuantity = Math.ceil(1 / +this.coin.priceUsd); 
      this.totalPrice = +this.coin.priceUsd * this.minQuantity;
      this.quantity = this.minQuantity;
    } else {
      this.totalPrice = 0;
      this.quantity = 0;
    }
  }
}
