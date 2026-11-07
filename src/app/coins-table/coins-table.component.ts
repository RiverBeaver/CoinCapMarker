import { Component, type OnInit, DOCUMENT, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { DecimalPipe, CurrencyPipe } from '@angular/common';
import type { HttpErrorResponse } from '@angular/common/http';

import { debounceTime, fromEvent } from 'rxjs';

import { NgxPaginationModule } from 'ngx-pagination';
import { CoinsService } from '../entities/services/coins.service';
import { SelectedCoinService } from '../entities/services/selected-coin.service';
import type { Coin } from '../entities/classes/coin.class';
import { ErrorComponent } from '../error/error.component';
import { ModalWindowsComponent } from '../modal-windows/modal-windows.component';
import { LoadingIndicatorComponent } from '../loading-indicator/loading-indicator.component';
import { CoinSearchComponent } from './coin-search/coin-search.component';
import { WINDOW } from '../core/tokens/window.token';

@Component({
    selector: 'coins-table',
    templateUrl: './coins-table.component.html',
    styleUrl: './coins-table.component.scss',
    imports: [
        ErrorComponent,
        ModalWindowsComponent,
        LoadingIndicatorComponent,
        CoinSearchComponent,
        NgxPaginationModule,
        DecimalPipe,
        CurrencyPipe,
    ],
})
export class CoinsTableComponent implements OnInit {
    private readonly coinsService = inject(CoinsService);
    private readonly selectedCoinService = inject(SelectedCoinService);
    private readonly router = inject(Router);
    private readonly document = inject<Document>(DOCUMENT);
    private readonly window = inject(WINDOW);
    private readonly destroyRef = inject(DestroyRef);

    private sortCount = [0, 0, 0, 0];

    protected readonly tableSizes = [100, 200] as const;

    protected allCoins: Coin[] = [];
    protected displayedCoins: Coin[] = [];
    protected page: number = 1;
    protected count: number = 0;
    protected tableSize: number = 100;

    protected isVisibleModalAddCoin: boolean = false;
    protected coinTransferredByModal: Coin | null = null;
    protected error: HttpErrorResponse | null = null;

    protected windowScrolled: boolean = false;

    protected searchMode: boolean = false;

    public ngOnInit() {
        this.loadCoins();
        this.onWindowScroll();
    }

    protected onTableDataChange(e: number) {
        this.page = e;
    }

    protected changeTableSize(event: Event) {
        this.tableSize = +(event.target as HTMLSelectElement).value;
        this.page = 1;
    }

    protected sort(index: number) {
        let key: string;
        switch (index) {
            case 1:
                key = 'priceUsd';
                break;
            case 2:
                key = 'changePercent24Hr';
                break;
            case 3:
                key = 'marketCapUsd';
                break;
            default:
                break;
        }
        if (this.sortCount[index] === 0 || this.sortCount[index] === 1) {
            this.displayedCoins?.sort((a, b) => +(b as any)[key] - +(a as any)[key]);
            this.sortCount[index] = -1;
        } else {
            this.displayedCoins?.sort((a, b) => +(a as any)[key] - +(b as any)[key]);
            this.sortCount[index] = 1;
        }
    }

    protected moreDetailed(coin: Coin) {
        this.selectedCoinService.select(coin);
        this.router.navigate([`/coins/${coin.id}`]);
    }

    protected coinsChange(event: { coins: Coin[]; value: string }) {
        if (event.value !== '') {
            this.displayedCoins = event.coins;
            this.searchMode = true;
        } else {
            this.displayedCoins = this.allCoins;
            this.page = 1;
            this.searchMode = false;
        }
    }

    protected addCoin(event: Event, coin: Coin) {
        event.stopPropagation();
        this.isVisibleModalAddCoin = true;
        this.coinTransferredByModal = coin;
    }

    protected closeModal() {
        this.isVisibleModalAddCoin = false;
        this.coinTransferredByModal = null;
    }

    protected scrollToTop() {
        const currentScroll =
            this.document.documentElement.scrollTop || this.document.body.scrollTop;
        if (currentScroll > 0) {
            window.scrollTo(0, 0);
        }
    }

    // one shared request; pagination, search and sorting then work client-side
    private loadCoins() {
        this.coinsService
            .getAssets()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (data: Coin[]) => {
                    this.allCoins = data.filter((coin) =>
                        this.coinsService.getCoinsWithoutEmptyLines(coin),
                    );
                    this.count = this.allCoins.length;
                    this.displayedCoins = this.allCoins;
                },
                error: (error: HttpErrorResponse) => {
                    this.error = error;
                },
            });
    }

    private onWindowScroll() {
        fromEvent(this.window, 'scroll')
            .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                if (
                    this.window.pageYOffset ||
                    this.document.documentElement.scrollTop ||
                    this.document.body.scrollTop > 100
                ) {
                    this.windowScrolled = true;
                } else if (
                    (this.windowScrolled && window.pageYOffset) ||
                    this.document.documentElement.scrollTop ||
                    this.document.body.scrollTop < 10
                ) {
                    this.windowScrolled = false;
                }
            });
    }
}
