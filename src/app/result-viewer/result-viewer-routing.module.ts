import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { ResultViewerComponent } from './result-viewer.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'result-viewer/last'
  },
  {
    path: ':id',
    component: ResultViewerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResultViewerRoutingModule {

}
