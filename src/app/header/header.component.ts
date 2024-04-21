import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Coin } from '../entities/classes/coin.class';
import { CoinsService } from '../entities/services/coins.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public topCoins!: Coin[];
  private subscription!: Subscription;

  constructor(
    private coinsService: CoinsService,
    private router: Router){}

  ngOnInit(): void {
    this.subscription = this.coinsService.getCoins(3).subscribe({next:(data: Coin[]) => this.topCoins = data})
  }

  ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }

  moreDetailed(id: string){
    this.router.navigate([`/coins/${id}`]);
  }
}
