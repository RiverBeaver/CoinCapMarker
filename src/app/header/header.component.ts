import { Component, type OnDestroy, type OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import type { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { NgClass, AsyncPipe, DecimalPipe, PercentPipe, CurrencyPipe } from '@angular/common';
import type { CoinInBriefcase } from '../entities/classes/coin-in-briefcase.class';
import type { Coin } from '../entities/classes/coin.class';
import { CoinsInBriefcaseService } from '../entities/services/coins-in-briefcase.service';
import { CoinsService } from '../entities/services/coins.service';
import { SelectedCoinService } from '../entities/services/selected-coin.service';
import { ModalWindowsComponent } from '../modal-windows/modal-windows.component';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    imports: [ModalWindowsComponent, NgClass, AsyncPipe, DecimalPipe, PercentPipe, CurrencyPipe],
})
export class HeaderComponent implements OnInit, OnDestroy {
    private readonly coinsService = inject(CoinsService);
    private readonly selectedCoinService = inject(SelectedCoinService);
    private readonly router = inject(Router);
    private readonly coinsInBriefcaseService = inject(CoinsInBriefcaseService);

    public topCoins!: Coin[];

    public differenceValue: BehaviorSubject<number>;

    public percentageDifferenceValue: BehaviorSubject<number>;

    public briefcaseValue: Observable<number>;

    public briefcase: CoinInBriefcase[] | null = null;

    private subscription!: Subscription;

    isVisualBriefcase: boolean = false;

    constructor() {
        this.briefcaseValue = this.coinsInBriefcaseService.briefcaseValue;
        this.differenceValue = this.coinsInBriefcaseService.differenceInValueOfCoins;
        this.percentageDifferenceValue =
            this.coinsInBriefcaseService.percentageDifferenceInValueOfCoins;
    }

    public ngOnInit(): void {
        this.subscription = this.coinsService.getTopCoins(3).subscribe({
            next: (data: Coin[]) => {
                this.topCoins = data;
            },
        });
    }

    moreDetailed(coin: Coin) {
        this.selectedCoinService.select(coin);
        this.router.navigate([`/coins/${coin.id}`]);
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
        this.subscription?.unsubscribe();
    }
}
