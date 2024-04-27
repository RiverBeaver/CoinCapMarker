import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Coin } from 'src/app/entities/classes/coin.class';

@Component({
  selector: 'coin-search',
  templateUrl: './coin-search.component.html',
  styleUrls: ['./coin-search.component.scss']
})
export class CoinSearchComponent {
  @Input() allCoins!: Coin[];
  public desiredСoin: string = '';

  @Output() onChangedDesiredСoin = new EventEmitter<{coins: Coin[], value: string}>();

  public searchCoin(event: Event) {
    this.desiredСoin = (event.target as HTMLInputElement).value;
    this.onChangedDesiredСoin.emit({coins: this.allCoins.filter(coin => coin.name.toLowerCase().includes(this.desiredСoin.toLowerCase())), value:this.desiredСoin});
  }
}