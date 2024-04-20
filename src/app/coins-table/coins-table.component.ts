import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Coin } from '../entities/classes/coin.class';
import { CoinsService } from '../entities/services/coins.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'coins-table',
  templateUrl: './coins-table.component.html',
  styleUrls: ['./coins-table.component.scss']
})
export class CoinsTableComponent implements OnInit, OnChanges, OnDestroy{
  coins: Coin[] = [];
  allCoins: Coin[] = [];
  private subscription!: Subscription;
  private sortCount = [0, 0, 0, 0];
  page:number = 1;
  count:number = 0;
  tableSize:number = 50;
  tableSizes:any = [10,15,20,25];
  
  constructor(private coinsService: CoinsService, private router: Router) {}

  ngOnInit() {
    this.getCoins();
  }

  getCoins() {
    this.subscription = this.coinsService.getCoins.subscribe({next:(data: Coin[]) => {
      this.coins = data.filter(coin => {
        if (!coin.priceUsd || !+(+coin.priceUsd).toFixed(2)) return false;
        if (!coin.marketCapUsd || !+(+coin.marketCapUsd).toFixed(2)) return false;
        if (!coin.changePercent24Hr || !+(+coin.changePercent24Hr).toFixed(2)) return false;
        return true;
      });
      this.allCoins = this.coins;
    }});   
  }

  onTableDataChange(e:any){
    this.page = e;
    // this.getCoins();
  }

  onSizeChange(e:any){
    this.tableSize = e.target.value;
    this.page = 1;
    // this.getCoins();
  }

  changeTableSize(event:Event) {
    this.tableSize = +(event.target as HTMLSelectElement).value
  }

  ngOnChanges(changes: SimpleChanges): void {
  }
  public sort(index: number) {
    let key: string;
    switch (index) {
      case 0: key = 'rank';
        break;
      case 1: key = 'priceUsd';
        break;
      case 2: key = 'changePercent24Hr';
        break;
      case 3: key = 'marketCapUsd';
    }
    if (this.sortCount[index] === 0 || this.sortCount[index] === 1) {
      this.coins?.sort((a, b) => +(b as any)[key] - +(a as any)[key]);
      this.sortCount[index] = -1;
    } else {
      this.coins?.sort((a, b) => +(a as any)[key] - +(b as any)[key]);
      this.sortCount[index] = 1;
    }
  }

  goHome(id: string){

    this.router.navigate([`/coins/${id}`]);
}

  coinsChange(event: Coin[]) {
    this.coins = event;
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
