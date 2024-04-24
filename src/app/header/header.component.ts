import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { CoinInBriefcase } from '../entities/classes/coin-in-briefcase.class';
import { Coin } from '../entities/classes/coin.class';
import { CoinsInBriefcaseService } from '../entities/services/coins-in-briefcase.service';
import { CoinsService } from '../entities/services/coins.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public topCoins!: Coin[];
  public differenceValue: BehaviorSubject<number>;
  public percentageDifferenceValue: BehaviorSubject<number>;
  public briefcaseValue: Observable<number>;
  public briefcase: CoinInBriefcase[] | null = null;
  private subscription!: Subscription;
  isVisualBriefcase: boolean = false;

  constructor(
    private coinsService: CoinsService,
    private router: Router,
    private coinsInBriefcaseService: CoinsInBriefcaseService){
      this.briefcaseValue = this.coinsInBriefcaseService.briefcaseValue;
      this.differenceValue = this.coinsInBriefcaseService.differenceInValueOfCoins;
      this.percentageDifferenceValue = this.coinsInBriefcaseService.percentageDifferenceInValueOfCoins;
    }

  ngOnInit(): void {
    this.subscription = this.coinsService.getCoins(3).subscribe({next:(data: Coin[]) => this.topCoins = data});
  }
  
  moreDetailed(id: string){
    this.router.navigate([`/coins/${id}`]);
  }

  openBriefcase() {
    this.briefcase = this.coinsInBriefcaseService.getBriefcase;
    this.isVisualBriefcase = true;
  }

  closeBriefcase() {
    this.briefcase = null;
    this.isVisualBriefcase = false;
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
