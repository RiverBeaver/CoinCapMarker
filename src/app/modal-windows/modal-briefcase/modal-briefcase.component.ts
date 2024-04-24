import { Component, Input, OnInit } from '@angular/core';
import { CoinInBriefcase } from 'src/app/entities/classes/coin-in-briefcase.class';
import { CoinsInBriefcaseService } from 'src/app/entities/services/coins-in-briefcase.service';

@Component({
  selector: 'modal-briefcase',
  templateUrl: './modal-briefcase.component.html',
  styleUrls: ['./modal-briefcase.component.scss']
})
export class ModalBriefcaseComponent implements OnInit {
  
  @Input() briefcase: CoinInBriefcase[] | null = null;

  constructor(private coinsInBriefcaseService: CoinsInBriefcaseService) {}

  ngOnInit(): void {
      this.briefcase?.forEach((coinInBriefcase: CoinInBriefcase) => coinInBriefcase.isHidden = true)
  }

  public deleteCoinFromBriefcase(coinInBriefcase: CoinInBriefcase) {
    this.coinsInBriefcaseService.removeCoin(coinInBriefcase);
    this.briefcase = this.coinsInBriefcaseService.getBriefcase;
  }

  getCurrentPrice(id: string): string {
    return this.coinsInBriefcaseService.getCurrentCoinPrice(id);
  }
}
