import { HttpErrorResponse } from '@angular/common/http';
import { Component, input, output } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { COINS_DATA_PROVIDER } from '../core/data-provider/data-provider.token';
import { Coin } from '../entities/classes/coin.class';
import { CoinsInBriefcaseService } from '../entities/services/coins-in-briefcase.service';
import { CoinsService } from '../entities/services/coins.service';
import { SelectedCoinService } from '../entities/services/selected-coin.service';
import { CoinSearchComponent } from './coin-search/coin-search.component';
import { CoinsTableComponent } from './coins-table.component';

@Component({
    selector: 'coin-search',
    template: '',
})
class CoinSearchStubComponent {
    public readonly allCoins = input<Coin[]>([]);
    public readonly desiredCoinChanged = output<{ coins: Coin[]; value: string }>();
}

const makeCoin = (id: string, priceUsd: string, changePercent24Hr = '1.5') =>
    new Coin(
        id,
        '1',
        'assets/img/icon.png',
        id.toUpperCase(),
        id,
        priceUsd,
        '1000000',
        changePercent24Hr,
    );

describe('CoinsTableComponent', () => {
    let fixture: ComponentFixture<CoinsTableComponent>;
    let getAssets: ReturnType<typeof vi.fn>;

    function create() {
        fixture = TestBed.createComponent(CoinsTableComponent);
        fixture.detectChanges();
        return fixture;
    }

    beforeEach(() => {
        getAssets = vi.fn();
        TestBed.configureTestingModule({
            imports: [CoinsTableComponent],
            providers: [
                provideRouter([]),
                { provide: COINS_DATA_PROVIDER, useValue: { getAssets } },
                CoinsService,
                CoinsInBriefcaseService,
            ],
        }).overrideComponent(CoinsTableComponent, {
            remove: { imports: [CoinSearchComponent] },
            add: { imports: [CoinSearchStubComponent] },
        });
    });

    it('creates and renders one row per coin with a price', () => {
        getAssets.mockReturnValue(
            of([
                makeCoin('bitcoin', '50000'),
                makeCoin('ethereum', '3000'),
                makeCoin('broken', ''),
            ]),
        );
        const rows = create().nativeElement.querySelectorAll('tbody tr');
        expect(rows.length).toBe(2);
        expect(rows[0].querySelector('.name')?.textContent?.trim()).toBe('bitcoin');
    });

    it('shows the error block instead of the table when loading fails', () => {
        getAssets.mockReturnValue(
            throwError(
                () =>
                    new HttpErrorResponse({
                        status: 500,
                        error: { error: 'Internal server error.' },
                    }),
            ),
        );
        const element = create().nativeElement;
        expect(element.querySelector('.status')?.textContent?.trim()).toBe('500');
        expect(element.querySelector('table')).toBeNull();
    });

    it('sorts by price descending on the first header click and ascending on the second', () => {
        getAssets.mockReturnValue(of([makeCoin('bitcoin', '50000'), makeCoin('ethereum', '3000')]));
        const element = create().nativeElement;
        const [priceHeader] = element.querySelectorAll('thead th span');

        priceHeader.dispatchEvent(new Event('click'));
        fixture.detectChanges();
        expect(element.querySelectorAll('tbody tr .name')[0].textContent?.trim()).toBe('bitcoin');

        priceHeader.dispatchEvent(new Event('click'));
        fixture.detectChanges();
        expect(element.querySelectorAll('tbody tr .name')[0].textContent?.trim()).toBe('ethereum');
    });

    it('narrows the table to search results and restores it when the search clears', () => {
        getAssets.mockReturnValue(of([makeCoin('bitcoin', '50000'), makeCoin('ethereum', '3000')]));
        const element = create().nativeElement;
        const search = fixture.debugElement.query(By.directive(CoinSearchStubComponent));

        search.componentInstance.desiredCoinChanged.emit({
            coins: [makeCoin('ethereum', '3000')],
            value: 'eth',
        });
        fixture.detectChanges();
        expect(element.querySelectorAll('tbody tr').length).toBe(1);
        expect(element.querySelector('.pagination-top')?.classList).toContain(
            'hide-when-searching',
        );

        search.componentInstance.desiredCoinChanged.emit({ coins: [], value: '' });
        fixture.detectChanges();
        expect(element.querySelectorAll('tbody tr').length).toBe(2);
    });

    it('stores the clicked coin and opens its page', () => {
        getAssets.mockReturnValue(of([makeCoin('bitcoin', '50000')]));
        create();
        const navigate = vi.spyOn(TestBed.inject(Router), 'navigate');
        fixture.nativeElement.querySelector('tbody tr').dispatchEvent(new Event('click'));
        expect(navigate).toHaveBeenCalledWith(['/coins/bitcoin']);
        expect(TestBed.inject(SelectedCoinService).selectedCoin()?.id).toBe('bitcoin');
    });

    it('opens the add-coin modal from the row button', () => {
        getAssets.mockReturnValue(of([makeCoin('bitcoin', '50000')]));
        const element = create().nativeElement;
        (element.querySelector('button.add') as HTMLButtonElement).click();
        fixture.detectChanges();
        expect(element.querySelector('.modal-title')?.textContent?.trim()).toBe('Add Coin');
    });
});
