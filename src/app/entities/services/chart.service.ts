import { Injectable, inject } from '@angular/core';
import { type Observable, shareReplay } from 'rxjs';
import { COINS_DATA_PROVIDER } from '../../core/data-provider/data-provider.token';

/** How long a fetched chart series is reused before a fresh request. */
const CACHE_TTL_MS = 2 * 60 * 1000;

@Injectable()
export class ChartService {
    private readonly provider = inject(COINS_DATA_PROVIDER);

    private readonly cache = new Map<
        string,
        { expiresAt: number; points$: Observable<number[][]> }
    >();

    public getChart(id: string, interval: string, days: number): Observable<number[][]> {
        const key = `${id}:${interval}:${days}`;
        const cached = this.cache.get(key);
        if (cached && Date.now() < cached.expiresAt) {
            return cached.points$;
        }

        const points$ = this.provider
            .getHistory(id, interval, days)
            .pipe(shareReplay({ bufferSize: 1, refCount: false }));
        this.cache.set(key, { expiresAt: Date.now() + CACHE_TTL_MS, points$ });
        // An eager subscription drops the entry when the request fails, so
        // the next call retries instead of replaying the cached error.
        points$.subscribe({ error: () => this.cache.delete(key) });
        return points$;
    }
}
