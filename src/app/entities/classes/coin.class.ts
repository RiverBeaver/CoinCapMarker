export class Coin {
    constructor (
        public id: string,
        public rank: string,
        public logo: string,
        public symbol: string,
        public name: string,
        public priceUsd: string,
        public marketCapUsd: string,
        public changePercent24Hr: string,
        public supply: string = '',
        public maxSupply: string = '',
    ) {}

}