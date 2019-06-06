import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { ResultViewerComponent } from './result-viewer.component';

const routes: Routes = [
  {
    path: 'result-viewer',
    pathMatch: 'full',
    redirectTo: 'result-viewer/last'
  },
  {
    path: 'result-viewer/:id',
    component: ResultViewerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResultViewerRoutingModule {

}
