import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoinsTableComponent } from './coins-table/coins-table.component';
import { InformationAboutCoinComponent } from './information-about-coin/information-about-coin.component';


const routes: Routes = [
  // { path: '', redirectTo: '/today', pathMatch: 'full' },
  { path: '', component: CoinsTableComponent},
  { path: 'coins/:id', component: InformationAboutCoinComponent},
  // { path: '**', component: NotFoundConteaner },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
