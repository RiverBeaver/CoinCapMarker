import { HttpErrorResponse } from '@angular/common/http';
import { Component, input } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HighchartsChartComponent } from 'highcharts-angular';
import { Subject, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { COINS_DATA_PROVIDER } from '../../core/data-provider/data-provider.token';
import { Coin } from '../../entities/classes/coin.class';
import { ChartService } from '../../entities/services/chart.service';
import { VisualChartsService } from '../../entities/services/visual-charts.service';
import { ChartComponent } from './chart.component';

@Component({
    selector: 'highcharts-chart',
    template: '',
})
class HighchartsChartStubComponent {
    public readonly options = input<unknown>(null);
}

const makeCoin = () =>
    new Coin(
        'bitcoin',
        '1',
        'assets/img/btc.png',
        'BTC',
        'Bitcoin',
        '50000',
        '900000000000',
        '2.5',
    );

describe('ChartComponent', () => {
    let fixture: ComponentFixture<ChartComponent>;
    let getHistory: ReturnType<typeof vi.fn>;
    let emittedError: HttpErrorResponse | undefined;

    function create() {
        fixture = TestBed.createComponent(ChartComponent);
        fixture.componentRef.setInput('coin', makeCoin());
        fixture.componentInstance.loadError.subscribe((error) => {
            emittedError = error;
        });
        fixture.detectChanges();
        return fixture;
    }

    beforeEach(() => {
        getHistory = vi.fn();
        emittedError = undefined;
        TestBed.configureTestingModule({
            imports: [ChartComponent],
            providers: [
                ChartService,
                VisualChartsService,
                { provide: COINS_DATA_PROVIDER, useValue: { getHistory } },
            ],
        }).overrideComponent(ChartComponent, {
            remove: { imports: [HighchartsChartComponent] },
            add: { imports: [HighchartsChartStubComponent] },
        });
    });

    it('creates and loads the 1-day chart for the coin by default', () => {
        getHistory.mockReturnValue(of([]));
        create();
        expect(fixture.componentInstance).toBeTruthy();
        expect(getHistory).toHaveBeenCalledWith('bitcoin', 'm5', 1);
    });

    it('renders one option per chart period', () => {
        getHistory.mockReturnValue(of([]));
        create();
        const optionElements = fixture.nativeElement.querySelectorAll(
            'select option',
        ) as HTMLOptionElement[];
        const options = Array.from(optionElements).map((option) => ({
            value: option.value,
            label: option.textContent?.trim(),
        }));
        expect(options).toEqual([
            { value: 'd1', label: '1 day' },
            { value: 'd7', label: '7 days' },
            { value: 'm1', label: '1 month' },
        ]);
    });

    it('loads the selected period on change', () => {
        getHistory.mockReturnValue(of([]));
        create();
        const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');

        select.value = 'd7';
        select.dispatchEvent(new Event('change'));
        expect(getHistory).toHaveBeenLastCalledWith('bitcoin', 'm15', 7);

        select.value = 'm1';
        select.dispatchEvent(new Event('change'));
        expect(getHistory).toHaveBeenLastCalledWith('bitcoin', 'h1', 30);
    });

    it('does not render the chart before points arrive', () => {
        getHistory.mockReturnValue(new Subject<number[][]>());
        create();
        expect(fixture.nativeElement.querySelector('highcharts-chart')).toBeNull();
    });

    it('renders the chart after points arrive', () => {
        getHistory.mockReturnValue(of([[1730000000000, 50000]]));
        create();
        expect(fixture.nativeElement.querySelector('highcharts-chart')).not.toBeNull();
    });

    it('emits loadError when the history request fails', () => {
        getHistory.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 500 })));
        create();
        expect(emittedError?.status).toBe(500);
    });
});
