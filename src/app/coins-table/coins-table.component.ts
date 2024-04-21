import { Component, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Coin } from '../entities/classes/coin.class';
import { CoinsService } from '../entities/services/coins.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'coins-table',
  templateUrl: './coins-table.component.html',
  styleUrls: ['./coins-table.component.scss']
})
export class CoinsTableComponent implements OnInit, OnDestroy{
  coins: Coin[] = [];
  allCoins: Coin[] = [];
  private subscription!: Subscription;
  private sortCount = [0, 0, 0, 0];
  page:number = 1;
  count:number = 0;
  tableSize:number = 50;
  tableSizes:any = [10,15,20,25];
  public error!: HttpErrorResponse;
  
  constructor(
    private coinsService: CoinsService, 
    private router: Router) {}

  ngOnInit() {
    this.getCoins();
  }

  getCoins() {
    this.subscription = this.coinsService.getCoins(2000).subscribe({next:(data: Coin[]) => {
      this.coins = data.filter(this.coinsService.getCoinsWithoutEmptyLines);
      this.allCoins = this.coins;
    },
    error: (error:HttpErrorResponse) => {
      this.error = error;
    }});   
  }

  onTableDataChange(e:any){
    this.page = e;
  }

  onSizeChange(e:any){
    this.tableSize = e.target.value;
    this.page = 1;
  }

  changeTableSize(event:Event) {
    this.tableSize = +(event.target as HTMLSelectElement).value;
  }

  public sort(index: number) {
    let key: string;
    switch (index) {
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

  moreDetailed(id: string){
    this.router.navigate([`/coins/${id}`]);
  }

  coinsChange(event: Coin[]) {
    this.coins = event;
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
