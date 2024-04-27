import { Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';
import { Coin } from '../entities/classes/coin.class';
import { CoinsService } from '../entities/services/coins.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { time } from 'highcharts';

@Component({
  selector: 'coins-table',
  templateUrl: './coins-table.component.html',
  styleUrls: ['./coins-table.component.scss']
})
export class CoinsTableComponent implements OnInit, OnDestroy{
  coins: Coin[] = [];
  allCoins: Coin[] = [];
  private sortCount = [0, 0, 0, 0];

  page:number = 1;
  count:number = 0;
  tableSize:number = 100;
  tableSizes:any = [100, 200];
  
  isVisibleModalAddCoin: boolean = false;
  coinTransferredByModal: Coin | null = null;

  error!: HttpErrorResponse;
  private subscription!: Subscription;
  private subscription2!:Subscription;

  windowScrolled!: boolean;
  searchMode: boolean = false;
  
  constructor(
    private coinsService: CoinsService, 
    private router: Router,
    @Inject(DOCUMENT) private document: Document) {}

  ngOnInit() {
    this.getAllCoins(2000);
    this.getCurrentCoins(this.tableSize);
  }

  getAllCoins(limit: number, offset: number = 0) {
    this.subscription = this.coinsService.getCoins(limit, offset).subscribe({next:(data: Coin[]) => {
      this.allCoins = data.filter(this.coinsService.getCoinsWithoutEmptyLines);
      this.count = +this.allCoins[this.allCoins.length-1].rank;
    },
    error: (error:HttpErrorResponse) => {
      this.error = error;
    }});   
  }

  getCurrentCoins(limit: number, offset: number = 0) {
    this.subscription2 = this.coinsService.getCoins(limit, offset).subscribe({next:(data: Coin[]) => {
      this.coins = data.filter(this.coinsService.getCoinsWithoutEmptyLines);
      this.subscription2.unsubscribe();
    },
    error: (error:HttpErrorResponse) => {
      this.error = error;
    }});   
  }

  onTableDataChange(e:any){
    this.page = e;
    this.getCurrentCoins(this.tableSize, this.tableSize * (this.page-1))
  }

  onSizeChange(e:any){
    this.tableSize = e.target.value;
    this.page = 1;
    this.getCurrentCoins(this.tableSize)
  }

  changeTableSize(event:Event) {
    this.tableSize = +(event.target as HTMLSelectElement).value;
    this.onTableDataChange(1)
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

  coinsChange(event: {coins: Coin[], value: string}) {
    if (event.value != '') {
      this.coins = event.coins;
      this.searchMode = true;
    } else {
      this.getCurrentCoins(this.tableSize);
      this.searchMode = false;
    }

  }

  addCoin(event:Event, coin: Coin) {
    event.stopPropagation();
    this.isVisibleModalAddCoin = true;
    this.coinTransferredByModal = coin;
  }

  closeModal() {
    this.isVisibleModalAddCoin = false;
    this.coinTransferredByModal = null;
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
      if (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 100) {
          this.windowScrolled = true;
      } 
     else if (this.windowScrolled && window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop < 10) {
          this.windowScrolled = false;
      }
  }
  scrollToTop() {
    var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
    if (currentScroll > 0) {
      window.scrollTo(0, 0);
    }
  }
}
