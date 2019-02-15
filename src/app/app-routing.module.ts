import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrowseComponent } from './browse/browse.component';
import { EditComponent } from './edit/edit.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LastResultComponent } from './last-result/last-result.component';

const routes: Routes = [
  {path: 'browse', component: BrowseComponent},
  // {path: 'new', component: NewQueryComponent},
  {path: 'edit/:id', component: EditComponent},
  {path: 'last-result', component: LastResultComponent},
  {path: '', pathMatch: 'full', redirectTo: 'browse'},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
