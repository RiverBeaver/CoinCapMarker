import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { map, Observable } from "rxjs";

@Injectable()
export class ChartService {
    constructor(private http: HttpClient){}

    getChart(id:string, interval:string, days: number): Observable<number[][]>  { 
        return this.http.get(`https://api.coincap.io/v2/assets/${id}/history?interval=${interval}&start=${Date.now()-1000*60*60*24*days}&end=${Date.now()}`).pipe(map((data:any)=>{

            let points = data["data"];
            let arrayPoints: any[] = [];

            for (let i = 0; i < points.length; i++) {
                let array = [
                    this.getTime(+points[i].time), 
                    this.getPrice(+points[i].priceUsd)
                ]
                arrayPoints.push(array)
            }

            return arrayPoints;
        }));   
    }

    private getTime(time: number) {
        return Math.floor(+time / 1000) * 1000 + -(new Date(time)).getTimezoneOffset()*60*1000;
    }

    private getPrice(price: number): number {
        if (price < 0.1) {
            return +(price).toFixed(5)
        } else if (price < 10) {
            return +(price).toFixed(4);
        } else {
            return +(price).toFixed(2)
        }
    }
}