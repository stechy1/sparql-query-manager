import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { EditQueryComponent } from './edit-query.component';

const routes: Routes = [
  {
    path: ':id',
    component: EditQueryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditQueryRoutingModule {

}
