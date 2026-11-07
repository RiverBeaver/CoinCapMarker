import { beforeEach, describe, expect, it } from 'vitest';
import { Coin } from '../classes/coin.class';
import { SelectedCoinService } from './selected-coin.service';

const makeCoin = (id: string) => new Coin(id, '1', '', id.toUpperCase(), id, '50000', '1000', '1');

describe('SelectedCoinService', () => {
    let service: SelectedCoinService;

    beforeEach(() => {
        service = new SelectedCoinService();
    });

    it('has no coin until one is selected', () => {
        expect(service.selectedCoin()).toBeNull();
    });

    it('stores and replaces the selected coin', () => {
        service.select(makeCoin('bitcoin'));
        expect(service.selectedCoin()?.id).toBe('bitcoin');

        service.select(makeCoin('ethereum'));
        expect(service.selectedCoin()?.id).toBe('ethereum');
    });
});
