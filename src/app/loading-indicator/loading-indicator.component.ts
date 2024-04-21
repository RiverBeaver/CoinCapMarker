import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadingService } from '../entities/services/loading.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: "loading-indicator",
  templateUrl: "./loading-indicator.component.html",
  styleUrls: ["./loading-indicator.component.scss"],
  imports: [MatProgressSpinnerModule, AsyncPipe, CommonModule],
  standalone: true,
})
export class LoadingIndicatorComponent {
  loading$: Observable<boolean>;
  @Input()
  detectRouteTransitions = false;
  constructor(
  public loadingService: LoadingService) {
    this.loading$ = this.loadingService.loading$;
  }
}