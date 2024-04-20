import { Injectable } from "@angular/core";
import {HttpClient} from "@angular/common/http";
import { Coin } from "../classes/coin.class";
import { interval, Observable } from "rxjs";
import { map } from "rxjs/operators";


@Injectable()
export class CoinsService {

    constructor(private http: HttpClient) {
    }

    get getCoins(): Observable<Coin[]> {
        return this.http.get(`https://api.coincap.io/v2/assets?limit=2000`).pipe(map((data:any)=>{
            let coins = data["data"];
            const arrayCoins: Coin[] = [];
            for (let i = 0; i < coins.length; i++) {
                arrayCoins.push(new Coin(
                    coins[i].id, 
                    coins[i].rank,
                    `https://assets.coincap.io/assets/icons/${coins[i].symbol.toLowerCase()}@2x.png`, 
                    coins[i].symbol, 
                    coins[i].name,
                    coins[i].priceUsd,
                    coins[i].marketCapUsd, 
                    coins[i].changePercent24Hr))
            }
            return arrayCoins;
        }));   
    }
}