import { HttpErrorResponse } from '@angular/common/http';
import { Component, input, output } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { COINS_DATA_PROVIDER } from '../core/data-provider/data-provider.token';
import { Coin } from '../entities/classes/coin.class';
import { CoinInfoService } from '../entities/services/coin-info.service';
import { SelectedCoinService } from '../entities/services/selected-coin.service';
import { ChartComponent } from './chart/chart.component';
import { InformationAboutCoinComponent } from './information-about-coin.component';

@Component({
    selector: 'chart',
    template: '',
})
class ChartStubComponent {
    public readonly coin = input<Coin | null>(null);
    public readonly loadError = output<HttpErrorResponse>();
}

const makeCoin = () =>
    new Coin(
        'bitcoin',
        '1',
        'assets/img/btc.png',
        'BTC',
        'Bitcoin',
        '50000.12',
        '900000000000',
        '2.5',
        '19000000',
        '21000000',
    );

describe('InformationAboutCoinComponent', () => {
    let fixture: ComponentFixture<InformationAboutCoinComponent>;
    let getAsset: ReturnType<typeof vi.fn>;

    function create(id: string, prepare?: () => void) {
        TestBed.configureTestingModule({
            imports: [InformationAboutCoinComponent],
            providers: [
                provideRouter([]),
                CoinInfoService,
                { provide: COINS_DATA_PROVIDER, useValue: { getAsset } },
                { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ id })) } },
            ],
        }).overrideComponent(InformationAboutCoinComponent, {
            remove: { imports: [ChartComponent] },
            add: { imports: [ChartStubComponent] },
        });
        prepare?.();
        fixture = TestBed.createComponent(InformationAboutCoinComponent);
        fixture.detectChanges();
        return fixture;
    }

    beforeEach(() => {
        getAsset = vi.fn();
    });

    it('creates and requests the coin for the route id', () => {
        getAsset.mockReturnValue(of(makeCoin()));
        create('ethereum');
        expect(fixture.componentInstance).toBeTruthy();
        expect(getAsset).toHaveBeenCalledWith('ethereum');
    });

    it('renders the stored coin without a network request', () => {
        getAsset.mockReturnValue(of(makeCoin()));
        const element = create('bitcoin', () => {
            TestBed.inject(SelectedCoinService).select(makeCoin());
        }).nativeElement;
        expect(getAsset).not.toHaveBeenCalled();
        expect(element.querySelector('.name')?.textContent?.trim()).toBe('Bitcoin');
    });

    it('fetches when the stored coin does not match the route id', () => {
        getAsset.mockReturnValue(of(makeCoin()));
        create('ethereum', () => {
            TestBed.inject(SelectedCoinService).select(makeCoin());
        });
        expect(getAsset).toHaveBeenCalledWith('ethereum');
    });

    it('stores the fetched coin for later visits', () => {
        getAsset.mockReturnValue(of(makeCoin()));
        create('bitcoin');
        expect(TestBed.inject(SelectedCoinService).selectedCoin()?.id).toBe('bitcoin');
    });

    it('renders the coin details', () => {
        getAsset.mockReturnValue(of(makeCoin()));
        const element = create('bitcoin').nativeElement;
        expect(element.querySelector('.name')?.textContent?.trim()).toBe('Bitcoin');
        expect(element.querySelector('.symbol')?.textContent?.trim()).toBe('BTC');
        expect(element.querySelector('.rank')?.textContent?.trim()).toBe('Rank: 1');
        expect(element.querySelector('.price-usd')?.textContent?.trim()).toContain('50,000.12');
        expect(element.querySelector('.max-supply, .other-info > div:last-child')).toBeTruthy();
    });

    it('links back to the main page', () => {
        getAsset.mockReturnValue(of(makeCoin()));
        const element = create('bitcoin').nativeElement;
        expect(element.querySelector('a.go-back')?.getAttribute('href')).toBe('/');
    });

    it('passes the loaded coin to the chart', () => {
        getAsset.mockReturnValue(of(makeCoin()));
        create('bitcoin');
        const chart = fixture.debugElement.query(By.directive(ChartStubComponent));
        expect(chart?.componentInstance.coin()?.id).toBe('bitcoin');
    });

    it('shows the error block instead of the page when the request fails', () => {
        getAsset.mockReturnValue(
            throwError(
                () =>
                    new HttpErrorResponse({
                        status: 404,
                        error: { error: 'Coin not found.' },
                    }),
            ),
        );
        const element = create('dogecoin').nativeElement;
        expect(element.querySelector('.status')?.textContent?.trim()).toBe('404');
        expect(element.querySelector('.info')).toBeNull();
    });

    it('shows the error block when the chart fails to load', () => {
        getAsset.mockReturnValue(of(makeCoin()));
        create('bitcoin');
        const chart = fixture.debugElement.query(By.directive(ChartStubComponent));
        chart?.componentInstance.loadError.emit(
            new HttpErrorResponse({ status: 503, error: { error: 'Chart unavailable.' } }),
        );
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.status')?.textContent?.trim()).toBe('503');
    });
});
