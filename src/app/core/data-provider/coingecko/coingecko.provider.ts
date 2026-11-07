import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { forkJoin, map, type Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Coin } from '../../../entities/classes/coin.class';
import { toChartPoint } from '../chart-point.util';
import type { ChartPoint, CoinsDataProvider } from '../coins-data-provider';
import type {
    CoinGeckoCoinResponse,
    CoinGeckoMarketChartResponse,
    CoinGeckoMarketDto,
} from './coingecko-dto';

/** CoinGecko pages /coins/markets by 250 items at most per request. */
const MARKETS_PAGE_SIZE = 250;

/** CoinGecko implementation of the market-data source (https://api.coingecko.com/api/v3). */
@Injectable()
export class CoinGeckoProvider implements CoinsDataProvider {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.coingecko.apiUrl;

    getAssets(limit = MARKETS_PAGE_SIZE, offset = 0): Observable<Coin[]> {
        const firstPage = Math.floor(offset / MARKETS_PAGE_SIZE) + 1;
        const pageCount = Math.ceil(limit / MARKETS_PAGE_SIZE);
        const pages = Array.from({ length: pageCount }, (_, i) => firstPage + i);

        return forkJoin(
            pages.map((page) =>
                this.http.get<CoinGeckoMarketDto[]>(`${this.apiUrl}/coins/markets`, {
                    params: this.authParams()
                        .set('vs_currency', 'usd')
                        .set('order', 'market_cap_desc')
                        .set('per_page', MARKETS_PAGE_SIZE)
                        .set('page', page),
                }),
            ),
        ).pipe(map((markets) => markets.flat().map((market) => this.marketToCoin(market))));
    }

    getAsset(id: string): Observable<Coin> {
        return this.http
            .get<CoinGeckoCoinResponse>(`${this.apiUrl}/coins/${id}`, {
                params: this.authParams()
                    .set('localization', 'false')
                    .set('tickers', 'false')
                    .set('market_data', 'true')
                    .set('community_data', 'false')
                    .set('developer_data', 'false')
                    .set('sparkline', 'false'),
            })
            .pipe(map((dto) => this.detailToCoin(dto)));
    }

    getHistory(id: string, interval: string, days: number): Observable<ChartPoint[]> {
        // CoinGecko derives granularity from `days` automatically, so the
        // CoinCap-specific `interval` is not mapped.
        return this.http
            .get<CoinGeckoMarketChartResponse>(`${this.apiUrl}/coins/${id}/market_chart`, {
                params: this.authParams().set('vs_currency', 'usd').set('days', days),
            })
            .pipe(map(({ prices }) => prices.map(([time, price]) => toChartPoint(time, price))));
    }

    /**
     * The demo key as a query parameter (officially supported alongside the
     * header) keeps requests CORS-simple: no custom header means the browser
     * sends no preflight, halving the request count against the rate limit.
     */
    private authParams(): HttpParams {
        return new HttpParams().set('x_cg_demo_api_key', environment.coingecko.apiKey);
    }

    private marketToCoin(market: CoinGeckoMarketDto): Coin {
        return new Coin(
            market.id,
            this.numToStr(market.market_cap_rank),
            market.image,
            market.symbol?.toUpperCase() ?? '',
            market.name,
            this.numToStr(market.current_price),
            this.numToStr(market.market_cap),
            this.numToStr(market.price_change_percentage_24h),
            this.numToStr(market.circulating_supply),
            this.numToStr(market.max_supply),
        );
    }

    private detailToCoin(dto: CoinGeckoCoinResponse): Coin {
        const md = dto.market_data;
        return new Coin(
            dto.id,
            this.numToStr(dto.market_cap_rank),
            dto.image?.large ?? '',
            dto.symbol?.toUpperCase() ?? '',
            dto.name,
            this.numToStr(md?.current_price?.['usd'] ?? null),
            this.numToStr(md?.market_cap?.['usd'] ?? null),
            this.numToStr(md?.price_change_percentage_24h ?? null),
            this.numToStr(md?.circulating_supply ?? null),
            this.numToStr(md?.max_supply ?? null),
        );
    }

    private numToStr(value: number | null | undefined): string {
        return value == null ? '' : String(value);
    }
}
