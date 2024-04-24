import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoinsTableComponent } from './coins-table/coins-table.component';
import { ErrorComponent } from './error/error.component';
import { InformationAboutCoinComponent } from './information-about-coin/information-about-coin.component';


const routes: Routes = [
  // { path: '', redirectTo: '/today', pathMatch: 'full' },
  { path: '', component: CoinsTableComponent},
  { path: 'coins/:id', component: InformationAboutCoinComponent},
  { path: '**', component: ErrorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { 
    scrollPositionRestoration: 'enabled', 
    anchorScrolling: 'enabled', 
    scrollOffset: [0, 64]
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
