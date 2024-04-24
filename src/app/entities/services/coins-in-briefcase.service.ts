import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { CoinInBriefcase } from "../classes/coin-in-briefcase.class";
import { Coin } from "../classes/coin.class";
import { CointInfoService } from "./coin-info.service";

@Injectable()
export class CoinsInBriefcaseService {
    public currentCoins: Coin[] = [];
    private _briefcase: CoinInBriefcase[];
    private _difference = new BehaviorSubject<number>(0);
    private _percentageDifference = new BehaviorSubject<number>(0);
    private _briefcaseValue = new BehaviorSubject<number>(0);

    constructor(private cointInfoService: CointInfoService) {
        const briefcaseFromLocalStorage = localStorage.getItem('briefcase');
        if (briefcaseFromLocalStorage === null) {
            localStorage.setItem('briefcase', JSON.stringify([]));
            this._briefcase = [];
        } else {
            this._briefcase = JSON.parse(briefcaseFromLocalStorage);
            this._briefcaseValue.next(this.getBriefcaseValue());
        }
        this.getCurrentCoins();
    }

    get getBriefcase(): CoinInBriefcase[] {
        return this._briefcase;
    }

    get briefcaseValue(): BehaviorSubject<number> {
        return this._briefcaseValue;
    }

    get differenceInValueOfCoins(): BehaviorSubject<number> {
        return this._difference;
    }

    get percentageDifferenceInValueOfCoins(): BehaviorSubject<number> {
        return this._percentageDifference;
    }

    addCoin(coin: Coin, quantity: number) {
        this._briefcase.push(new CoinInBriefcase(coin, quantity, Date.now()));
        localStorage.setItem('briefcase', JSON.stringify(this._briefcase));

        this._briefcaseValue.next(this.getBriefcaseValue());

        if (!this.currentCoins.find((currentCoin: Coin) => {
            return currentCoin.id === coin.id;
        })) this.currentCoins.push(coin);
        this.updateDifference();
    }

    removeCoin(coinInBriefcase: CoinInBriefcase) {
        const indexCoin = this._briefcase.findIndex((coin: CoinInBriefcase) => {
            return coin.timeAddition === coinInBriefcase.timeAddition;
        });
        if (indexCoin + 1){
            this._briefcase.splice(indexCoin, 1);
            localStorage.setItem('briefcase', JSON.stringify(this._briefcase));

            this._briefcaseValue.next(this.getBriefcaseValue());
            this.updateDifference();
        }  else console.log('Не найден');

    }

    getCurrentCoinPrice(id: string):  string{
        const coin = this.currentCoins.find((coin: Coin) => coin.id === id);
        if (!coin) return '';
        return coin.priceUsd;
    }

    private getCurrentCoins() {
        let arrayId: string[] = [];
        this._briefcase.forEach((coinInBriefcase) => {
            if (arrayId.find((id: string) => {
                return id === coinInBriefcase.coin.id
            })) return;
            else arrayId.push(coinInBriefcase.coin.id);
        });
        arrayId.forEach((id) => {
            this.fillCurrentCoinsWithNewCoin(id);
        });
    }

    private fillCurrentCoinsWithNewCoin(id: string) {
        this.cointInfoService.getCoinInfo(id).subscribe({
            next: (data: Coin) => {
                this.currentCoins.push(data)
                this.updateDifference();
            }
        })
    }

    private updateDifference() {
        const value = this.currentCoins.reduce((acc: number, coin: Coin) => {
            let quantity = this._briefcase.filter((coinInBriefcase) => {
                return coinInBriefcase.coin.id === coin.id;
            }).reduce((quantity: number, coinInBriefcase) => {
                return quantity + coinInBriefcase.quantity;
            }, 0)
            return acc + +coin.priceUsd * quantity;
        }, 0);
        this._difference.next(value - this.getBriefcaseValue());
        this._percentageDifference.next((value - this.getBriefcaseValue()) / this.getBriefcaseValue());
    }

    private getBriefcaseValue(): number {
        return this._briefcase.reduce((briefcaseValue: number, coinInBriefcase) => {
            return briefcaseValue + +coinInBriefcase.coin.priceUsd * coinInBriefcase.quantity;
        }, 0);
    }
}