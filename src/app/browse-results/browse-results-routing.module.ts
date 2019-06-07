import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { BrowseResultsComponent } from './browse-results.component';

const routes: Routes = [
  {
    path: '',
    component: BrowseResultsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrowseResultsRoutingModule {

}
