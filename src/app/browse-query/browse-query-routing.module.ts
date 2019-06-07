import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { SearchComponent } from './search/search.component';
import { BrowseToolbarComponent } from './browse-toolbar/browse-toolbar.component';
import { BrowseQueryComponent } from './browse-query.component';

const routes: Routes = [
  {
    path: 'browse-query',
    component: BrowseQueryComponent,
    data: {
      'sidebar': BrowseToolbarComponent,
      'navbar': SearchComponent
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrowseQueryRoutingModule {

}
