import { Coin } from "./coin.class";

export class CoinInBriefcase{
    
    constructor(
        public coin: Coin,
        public quantity: number,
        public timeAddition: number,
        public isHidden: boolean = false
    ){}
}