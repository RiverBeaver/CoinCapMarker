import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { Coin } from "../classes/coin.class";

@Injectable()
export class CoinInfo {
    constructor(private http: HttpClient) {
    }

    public getCoinInfo(id: string): Observable<Coin> {
        return this.http.get(`https://api.coincap.io/v2/assets/${id}`).pipe(map((data:any)=>{
            let coin = data["data"];
            return new Coin(
                    coin.id, 
                    coin.rank,
                    `https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`, 
                    coin.symbol, 
                    coin.name,
                    coin.priceUsd,
                    coin.marketCapUsd, 
                    coin.changePercent24Hr,
                    coin.supply,
                    coin.maxSupply,
                    )
        }));   
    }
}