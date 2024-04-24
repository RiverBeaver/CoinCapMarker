import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { Coin } from '../entities/classes/coin.class';
import { CointInfoService } from '../entities/services/coin-info.service';


@Component({
  selector: 'app-information-about-coin',
  templateUrl: './information-about-coin.component.html',
  styleUrls: ['./information-about-coin.component.scss']
})
export class InformationAboutCoinComponent implements OnDestroy {
  id!: string;
  public coin!: Coin;
  public error: HttpErrorResponse | null = null;
  private subscription!: Subscription;

  isVisibleModalAddCoin: boolean = false;
  coinTransferredByModal: Coin | null = null;

  constructor(
    private route: ActivatedRoute, 
    private cointInfoService: CointInfoService){
  }
  ngOnInit() {
    this.route.paramMap.pipe(
        switchMap(params => params.getAll("id"))
    )
    .subscribe(data=> {
      this.id = data;
      this.error = null
      this.getCionInfo();
    });
  }

  public getCionInfo() {
    this.subscription = this.cointInfoService.getCoinInfo(this.id).subscribe({next:(data: Coin) => {
      this.coin = data;
    },
    error: (error:HttpErrorResponse) => {
      this.error = error;
    }});
  }

  errorOccurred(error: HttpErrorResponse) {
    this.error = error;
  }

  addCoin(event:Event, coin: Coin) {
    event.stopPropagation()
    this.isVisibleModalAddCoin = true;
    this.coinTransferredByModal = coin;
  }

  closeModal() {
    this.isVisibleModalAddCoin = false;
    this.coinTransferredByModal = null;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  
}
