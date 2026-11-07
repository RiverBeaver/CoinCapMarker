import { Injectable, signal } from '@angular/core';
import type { Coin } from '../classes/coin.class';

/**
 * In-memory store for the coin whose row was last clicked (table or header
 * top-coins). The coin page renders it without a redundant getAsset request;
 * a full page reload empties the store, and the page falls back to fetching
 * by route id.
 */
@Injectable({
    providedIn: 'root',
})
export class SelectedCoinService {
    private readonly selected = signal<Coin | null>(null);

    public readonly selectedCoin = this.selected.asReadonly();

    public select(coin: Coin): void {
        this.selected.set(coin);
    }
}
