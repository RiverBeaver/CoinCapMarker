import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { COINS_DATA_PROVIDER } from '../../core/data-provider/data-provider.token';
import { ChartService } from './chart.service';

describe('ChartService', () => {
    let service: ChartService;
    let getHistory: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        getHistory = vi.fn().mockReturnValue(of([[1, 2]]));
        TestBed.configureTestingModule({
            providers: [ChartService, { provide: COINS_DATA_PROVIDER, useValue: { getHistory } }],
        });
        service = TestBed.inject(ChartService);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('serves the same coin and period from one request', () => {
        service.getChart('bitcoin', 'm5', 1).subscribe();
        service.getChart('bitcoin', 'm5', 1).subscribe();
        expect(getHistory).toHaveBeenCalledTimes(1);
    });

    it('requests each period separately', () => {
        service.getChart('bitcoin', 'm5', 1).subscribe();
        service.getChart('bitcoin', 'h1', 30).subscribe();
        expect(getHistory).toHaveBeenCalledTimes(2);
    });

    it('refetches after the cache expires', () => {
        vi.useFakeTimers();
        service.getChart('bitcoin', 'm5', 1).subscribe();
        vi.advanceTimersByTime(2 * 60 * 1000 + 1);
        service.getChart('bitcoin', 'm5', 1).subscribe();
        expect(getHistory).toHaveBeenCalledTimes(2);
    });

    it('retries the next call after a failed request', () => {
        getHistory.mockReturnValueOnce(throwError(() => new Error('boom')));
        service.getChart('bitcoin', 'm5', 1).subscribe({ error: () => undefined });
        service.getChart('bitcoin', 'm5', 1).subscribe();
        expect(getHistory).toHaveBeenCalledTimes(2);
    });
});
